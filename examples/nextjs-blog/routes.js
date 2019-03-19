const routes = require('next-routes')()

routes
  .add('/blog', '/blog/list')
  .add('/blog/:slug', '/blog/post')
  .add('/authors', '/authors/list')
  .add('/authors/:id', '/authors/profile')

module.exports = routes
