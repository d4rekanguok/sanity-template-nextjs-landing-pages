const { SitemapStream, streamToPromise } = require('sitemap')
const fs = require('fs/promises')
const client = require('./client')

const configQuery = `*[_id == "global-config"] {url}[0]`

const routeQuery = `
*[_type == 'page'] {
  'slug': slug.current,
  disallowRobots,
  includeInSitemap,
  _updatedAt
}
`

Promise.all([configQuery, routeQuery].map(query => client.fetch(query)))
  .then(results => {
    const [ config, routes ] = results

    const smStream = new SitemapStream({ hostname: config.url })

    routes.forEach(route => {
      const { slug, disallowRobots = false, includeInSitemap = true, _updatedAt } = route

      if (!includeInSitemap || disallowRobots) {
        return
      }

      const url = slug === '/' ? '/' : `/${slug}`
      smStream.write({
        url,
        // Uncomment this if you need lastmod i.e not evergreen content
        // lastmod: new Date(_updatedAt),

        // other config
        // changefreq: 'daily',
        // priority: 0.5,
      });
    });

    smStream.end()
    return streamToPromise(smStream)
  })
  .then(sitemapRes => {
    const output = sitemapRes.toString()
    return fs.writeFile(`./out/sitemap.xml`, output)
  })
  .then(() => {
    console.log(`sitemap.xml updated`)
  })
