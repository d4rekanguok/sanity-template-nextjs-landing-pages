import groq from 'groq'
import client from '../../client'

function Post({ data }) {
  return (
    <div>{data.title}</div>
  )
}

export default Post

const postQuery = `
*[_type == 'blog' && slug.current == $slug][0] {
  'slug': slug.current,
   body,
   mainImage,
   title,
 }
`

export async function getStaticProps({ params }) {
  const { slug = "" } = params
  const data = await client.fetch(postQuery, { slug })
  return {
    revalidate: 60,
    props: {
      data,
    }
  }
}

export const getStaticPaths = async () => {
  const paths = await client.fetch(groq`
    *[_type == "blog"]{
      "params": { "slug": slug.current }
    }
  `)
  
  return {
    paths,
    fallback: false,
  }
}