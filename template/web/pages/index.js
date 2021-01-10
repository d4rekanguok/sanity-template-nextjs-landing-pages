import React, {Component} from 'react'
import client from '../client'
import groq from 'groq'
import Page from '../components/Page'

const landingPageQuery = groq`
  *[_type == "page" && slug.current == '/'][0]{
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

export async function getStaticProps({ preview = false }) {
  const data = await client.fetch(landingPageQuery)
  return {
    revalidate: 60,
    props: {
      preview,
      data,
    }
  }
}