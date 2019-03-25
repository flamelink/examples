import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import PropTypes from 'prop-types'
import flush from 'styled-jsx/server'

class CustomDocument extends Document {
  getInitialProps = ctx => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    let pageContext
    const page = ctx.renderPage(Component => {
      const WrappedComponent = props => {
        pageContext = props.pageContext
        return <Component {...props} />
      }

      WrappedComponent.propTypes = {
        pageContext: PropTypes.object.isRequired,
      }

      return WrappedComponent
    })

    let css
    // It might be undefined, e.g. after an error.
    if (pageContext) {
      css = pageContext.sheetsRegistry.toString()
    }

    return {
      ...page,
      pageContext,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: (
        <React.Fragment>
          <style
            id="jss-server-side"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: css }}
          />
          {flush() || null}
        </React.Fragment>
      ),
    }
  }

  render() {
    const { pageContext } = this.props

    return (
      <html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={
              pageContext ? pageContext.theme.palette.primary.main : '#5138ef'
            }
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Nunito:300,400,500,900"
          />
          <style global jsx>{`
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

            button,
            .button {
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

            button:hover,
            .button:hover {
              color: #fff;
              background-color: var(--primary-color);
            }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

export default CustomDocument
