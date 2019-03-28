const express = require('express')
const next = require('next')
const fs = require('fs')
const routes = require('./routes')

const port = parseInt(process.env.PORT, 10) || 3000
const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handler = routes.getRequestHandler(app)

const { DESTINATION, createSitemap } = require('./sitemap')

app.prepare().then(() => {
  const server = express()

  // This `server.get()` lets you generate a sitemap on the fly and retrive it from http://your.domain/sitemap.xml
  // It also create a file if you need to open it with your editor.
  server.get('/sitemap.xml', function(req, res) {
    res.header('Content-Type', 'application/xml')
    ;(async function sendXML() {
      let xmlFile = await createSitemap()
      // Send it to the browser
      res.send(xmlFile)
      // Create a file on the selected destination
      fs.writeFileSync(DESTINATION, xmlFile)
    })()
  })

  server.get('*', (req, res) => {
    return handler(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
