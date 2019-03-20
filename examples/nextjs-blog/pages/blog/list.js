import { flamelinkApp as app } from '../../utils/flamelink'
import { Link } from '../../routes'
import { getPostsWithMedia, getImageAlt } from '../../utils/post/post.util'

const Posts = function(props) {
  const { posts } = props

  if (posts) {
    return posts.map(post => {
      const {
        title,
        slug,
        author: { displayName },
        excerpt,
        _fl_meta_: { docId },
        imageURL,
        date,
      } = post

      return (
        <div key={docId}>
          <Link route={`/blog/${slug}`}>
            {/* href gets added to <a> by <Link> */}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>{`${title} - ${displayName}`}</a>
          </Link>
          <p>{excerpt}</p>
          <img src={imageURL} alt={getImageAlt(post)} />
          <p>{new Date(date).toLocaleDateString()}</p>
        </div>
      )
    })
  }

  throw new Error('No posts!')
}

Posts.getInitialProps = async () => {
  const posts = await app.content.get({ schemaKey: 'blogPost', populate: true })
  const filteredPosts = await Promise.all(
    getPostsWithMedia(
      Object.values(posts || {})
        .filter(post => post.status === 'published')
        .sort((postA, postB) => {
          // "2019-03-18T12:00:00+02:00"
          const dateA = new Date(postA.date)
          const dateB = new Date(postB.date)

          if (dateA < dateB) return -1
          if (dateA > dateB) return 1
          return 0
        })
    )
  )

  return {
    posts: filteredPosts,
  }
}

export default Posts
