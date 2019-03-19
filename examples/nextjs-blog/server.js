const next = require('next')
const routes = require('./routes')
const { createServer } = require('http')

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handler = routes.getRequestHandler(app)

const port = process.env.PORT || 3000

app.prepare().then(() => {
  createServer(handler).listen(port, err => {
    if (err) throw err
    console.log(`Ready on localhost:${port}`)
  })
})
