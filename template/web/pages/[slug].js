import React, {Component} from 'react'
import client from '../client'
import groq from 'groq'
import Page from '../components/Page'

const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    ...,
    content[] {
      ...,
      cta {
        ...,
        route->
      },
      ctas[] {
        ...,
        route->
      }
    }
  }
`

const PageWrapper = (props) => {
  return (<Page {...props} />)
}
export default PageWrapper

export async function getStaticProps({ params, preview = false }) {
  const { slug = "" } = params
  const data = await client.fetch(pageQuery, { slug })
  return {
    revalidate: 60,
    props: {
      preview,
      data,
    }
  }
}

export const getStaticPaths = async () => {
  const paths = await client.fetch(groq`
    *[_type == "page"]{
      "params": { "slug": slug.current }
    }
  `)
  
  return {
    paths,
    // Note: Use `fallback: true` if you want to deploy a live Next app.
    // read more: https://nextjs.org/docs/basic-features/data-fetching#fallback-true
    fallback: false,
  }
}