import Link from 'next/link'
import client from '../../client'

export default function BlogIndexPage({ data = [] }) {
  return (
    <ul>
      {data.map(post => (
        <li key={post._id}>
          <Link href={`/blog/${post.slug}`}>
            <a>{post.title}</a>
          </Link>
        </li>
      ))}
    </ul>
)
}

export async function getStaticProps() {
  const data = await client.fetch(`
    *[_type == 'blog'] {
      _id,
      'slug': slug.current,
      title,
      mainImage {
        asset ->
      }
    }
  `)
  return {
    revalidate: 60,
    props: {
      data,
    }
  }
}