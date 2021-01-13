import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import React, {Component} from 'react'
import {NextSeo} from 'next-seo'
import imageUrlBuilder from '@sanity/image-url'
import Layout from './Layout'
import RenderSections from './RenderSections'
import client from '../client'

const builder = imageUrlBuilder(client)

function Page({ preview, data, siteConfig: config = {}}) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }


  const {
    title = 'Missing title',
    description,
    disallowRobots,
    openGraphImage,
    content = [],
    slug
  } = data

  const openGraphImages = openGraphImage
    ? [
      {
        url: builder
          .image(openGraphImage)
          .width(800)
          .height(600)
          .url(),
        width: 800,
        height: 600,
        alt: title
      },
      {
        // Facebook recommended size
        url: builder
          .image(openGraphImage)
          .width(1200)
          .height(630)
          .url(),
        width: 1200,
        height: 630,
        alt: title
      },
      {
        // Square 1:1
        url: builder
          .image(openGraphImage)
          .width(600)
          .height(600)
          .url(),
        width: 600,
        height: 600,
        alt: title
      }
    ]
    : []

  return (
    <Layout config={config}>
      <NextSeo
        config={{
          title,
          titleTemplate: `${config.title} | %s`,
          description,
          canonical: config.url && `${config.url}/${slug}`,
          openGraph: {
            images: openGraphImages
          },
          noindex: disallowRobots
        }}
      />
      {content && <RenderSections sections={content} />}
    </Layout>
  )
}

Page.propTypes = {
  preview: PropTypes.bool,
  siteConfig: PropTypes.any,
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    // TODO: improve types
    disallowRobots: PropTypes.any,
    openGraphImage: PropTypes.any,
    content: PropTypes.any,
    config: PropTypes.any,
    slug: PropTypes.any
  })
};

export default Page