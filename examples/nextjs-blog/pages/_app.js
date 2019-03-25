import React from 'react'
import App, { Container } from 'next/app'
import NextSeo from 'next-seo'
import { flamelinkApp } from '../utils/flamelink'

import Header from '../components/header'
import Footer from '../components/footer'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    const globalSettings = await flamelinkApp.settings.getGlobals()

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, globalSettings }
  }

  render() {
    const { Component, pageProps, globalSettings } = this.props

    return (
      <Container>
        {/* Here we call NextSeo and pass our default configuration to it  */}
        <NextSeo
          config={{
            title: globalSettings.siteTitle,
            titleTemplate: `%s | ${globalSettings.siteTitle}`,
            description: globalSettings.tagline,
          }}
        />
        <Header />
        <main>
          <Component globals={globalSettings} {...pageProps} />
        </main>
        <Footer />
      </Container>
    )
  }
}

export default MyApp
