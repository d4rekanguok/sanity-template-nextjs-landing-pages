import { SitemapStream, streamToPromise } from 'sitemap'
import groq from 'groq'
import client from '../../client'

const configQuery = groq`*[_id == "global-config"] {url}[0]`

const routeQuery = groq`
*[_type in ['page', 'blog']] {
  'slug': slug.current,
  _type == 'page' && slug.current != '/' => {
    'slug': '/' + slug.current
  },
  _type == 'blog' => {
    'slug': '/blog/' + slug.current
  },
  disallowRobots,
  includeInSitemap,
  _updatedAt
}
`

export default async (req, res) => {
  try {
    const [config, routes] = await Promise.all([configQuery, routeQuery].map(query => client.fetch(query)))
    if (Object.keys(config).length === 0 || Object.keys(routes).length === 0) {
      throw new Error('No data')
    }

    const smStream = new SitemapStream({ hostname: config.url })
  
    routes.forEach(route => {
      const { slug, disallowRobots = false, includeInSitemap = true, _updatedAt } = route
  
      if (!includeInSitemap || disallowRobots) {
        return
      }
  
      smStream.write({
        url: slug,
        // Uncomment this if you need lastmod i.e not evergreen content
        // lastmod: new Date(_updatedAt),
  
        // other config
        // changefreq: 'daily',
        // priority: 0.5,
      })
    })
  
    smStream.end()
    const output = (await streamToPromise(smStream)).toString()
  
    res.writeHead(200, {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400',
    })
    res.end(output)

  } catch (e) {
    console.log(e)
    res.status(500)
    res.end()
  }
}
