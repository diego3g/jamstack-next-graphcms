import { GetStaticPaths, GetStaticProps } from "next"
import { PostDocument, usePostQuery } from "../../generated/graphql"
import { client, ssrCache } from "../../lib/urql"

export default function Post({ slug }) {
  const [{ data: { post } }] = usePostQuery({
    variables: {
      slug,
    }
  })

  return (
    <div className="relative pb-16 bg-white overflow-hidden">
      <img className="w-full h-96 object-cover" src={post.coverImage.url} />

      <div className="relative px-4 pt-16 sm:px-6 lg:px-8">
        <div className="text-lg max-w-prose mx-auto">
          <h1>
            <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {post.title}
            </span>
          </h1>
        </div>
        
        <div 
          className="mt-6 prose prose-lg mx-auto" 
          dangerouslySetInnerHTML={{ __html: post.content.html }} 
        />
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await client.query(PostDocument, { slug: params.slug }).toPromise()

  return {
    props: {
      urqlState: ssrCache.extractData(),
      slug: params.slug,
    },
    revalidate: 60 * 60 * 4, // 4 hours
  }
}