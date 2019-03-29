const path = require('path')
const get = require('lodash/get')
const fs = require('fs')
const { format } = require('date-fns')
const admin = require('firebase-admin')
const flamelink = require('flamelink/app')
require('flamelink/settings')
require('flamelink/content')
require('flamelink/storage')
require('flamelink/navigation')
require('flamelink/users')
const { routes } = require('./routes')

const firebaseApp = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })

const flamelinkApp = flamelink({
  firebaseApp,
  dbType: 'cf',
  environment: 'production',
  locale: 'en-US',
})

// If you use Dotenv you can include your .env variables uncommenting the following line
require('dotenv').config()

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

// SITE_ROOT is the domain of your app
// Update example.com with your domain or set the env variable
const SITE_ROOT = process.env.SITE_ROOT || 'https://example.com'

// DESTINATION is where the real file is exported
// By default is .next/static/sitemap.xml
const DESTINATION =
  process.env.DESTINATION ||
  path.join(resolveApp('.next/static'), 'sitemap.xml')

const createSitemap = async () => {
  let xml = ''
  xml += '<?xml version="1.0" encoding="UTF-8"?>'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

  const [authors, blogPosts] = await Promise.all([
    flamelinkApp.users.get(),
    flamelinkApp.content.get({
      schemaKey: 'blogPost',
      filters: [['status', '==', 'published']],
    }),
  ])

  const DATE_FORMAT = 'YYYY-MM-DD'

  routes.forEach(route => {
    let stats = fs.statSync(path.join(resolveApp('pages'), `${route.page}.js`))
    let lastMod = format(stats.mtime, DATE_FORMAT)

    let fullRoute = `${SITE_ROOT}${route.pattern}`

    if (route.pattern === '/authors/:id') {
      Object.values(authors).forEach(author => {
        const authorRoute = fullRoute.replace(':id', author.id)
        xml += '<url>'
        xml += `<loc>${authorRoute}</loc>`
        xml += `<lastmod>${format(
          get(
            author,
            '_fl_meta_.lastModifiedDate._seconds',
            get(
              author,
              '_fl_meta_.createdDate._seconds',
              new Date().getSeconds()
            )
          ) * 1000,
          DATE_FORMAT
        )}</lastmod>`
        xml += `<changefreq>always</changefreq>`
        xml += `<priority>0.7</priority>`
        xml += '</url>'
      })
    } else if (route.pattern === '/blog/:slug') {
      Object.values(blogPosts).forEach(blogPost => {
        const postRoute = fullRoute.replace(':slug', blogPost.slug)
        xml += '<url>'
        xml += `<loc>${postRoute}</loc>`
        xml += `<lastmod>${format(
          get(
            blogPost,
            '_fl_meta_.lastModifiedDate._seconds',
            get(
              blogPost,
              '_fl_meta_.createdDate._seconds',
              new Date().getSeconds()
            )
          ) * 1000,
          DATE_FORMAT
        )}</lastmod>`
        xml += `<changefreq>always</changefreq>`
        xml += `<priority>0.9</priority>`
        xml += '</url>'
      })
    } else {
      xml += '<url>'
      xml += `<loc>${fullRoute}</loc>`
      xml += `<lastmod>${lastMod}</lastmod>`
      xml += `<changefreq>always</changefreq>`
      xml += `<priority>0.5</priority>`
      xml += '</url>'
    }
  })

  xml += '</urlset>'
  return xml
}

module.exports = { DESTINATION, createSitemap }
