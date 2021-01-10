import React from 'react'
import App from 'next/app'
import client from '../client'
// import 'normalize.css'
import groq from 'groq'
import '../styles/shared.module.css'
import '../styles/layout.css'

const siteConfigQuery = groq`
  *[_id == "global-config"][0] {
    ...,
    logo {asset->{extension, url}},
    mainNavigation[] -> {
      ...,
      "title": page->title
    },
    footerNavigation[] -> {
      ...,
      "title": page->title
    }
  }
`

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)
  // Add site config from sanity
  const config = await client.fetch(siteConfigQuery)
  if (config) appProps.pageProps.siteConfig = config
  return { ...appProps }
}

export default MyApp