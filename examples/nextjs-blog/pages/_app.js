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

        <style global jsx>{`
          @import url('https://fonts.googleapis.com/css?family=Nunito:300,400,500,900');

          :root {
            --primary-color: #5138ef;
            --bg-color: #fff;
            --text-color: #6d6e70;
            --footer-bg-color: #161616;
            --footer-text-color: #fff;
            --container-wide: 85rem;
            --container-medium: 56rem;
          }

          html {
            font-size: 14px;
            box-sizing: border-box;
          }

          *,
          *:before,
          *:after {
            box-sizing: inherit;
          }

          body {
            margin: 0;
            font-family: 'Nunito', sans-serif;
            line-height: 1.57;
            color: var(--text-color);
          }

          main {
            min-height: calc(100vh - 240px);
          }

          h1 {
            font-size: 3.42rem;
            font-weight: 500;
            line-height: 0.71;
          }

          h2 {
            font-size: 2.85rem;
            font-weight: 900;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            color: var(--primary-color);
            margin: 1.7rem 0;
          }

          h3 {
            font-size: 2.71rem;
            font-weight: 400;
            font-style: normal;
            line-height: 1.11;
            letter-spacing: normal;
            color: var(--primary-color);
          }

          h4 {
            font-size: 2rem;
            font-weight: 400;
            line-height: 1.14;
            color: var(--primary-color);
            margin: 0 0 1.5rem;
          }

          strong {
            font-weight: 900;
          }

          a {
            text-decoration: none;
            color: var(--primary-color);
          }

          blockquote {
            border-left: 2px solid var(--primary-color);
            color: var(--primary-color);
            font-size: 2rem;
            font-weight: 400;
            line-height: 1.14;
            padding: 1rem 0 1rem 2.6rem;
          }

          button {
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
            border-radius: 3px;
            background-color: transparent;
            transition: background 0.25s ease;
            cursor: pointer;
            font-size: 1.14rem;
            line-height: 0.81;
            text-align: center;
            text-transform: uppercase;
            padding: 1.25rem;
            min-width: 12.5rem;
            max-width: 100%;
          }

          button:hover {
            color: #fff;
            background-color: var(--primary-color);
          }
        `}</style>
      </Container>
    )
  }
}

export default MyApp
