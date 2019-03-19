import { flamelinkApp as app } from '../../utils/flamelink'
import { Link } from '../../routes'

const Posts = function(props) {
  const { posts } = props

  if (posts && posts.length > 0) {
    return Object.values(props.posts).map(post => {
      const {
        title,
        slug,
        author: { displayName },
        excerpt,
        _fl_meta_: { docId },
        // imageURL,
        date,
      } = post

      return (
        <div key={docId}>
          <Link route={`/blog/${slug}`}>{`${title} - ${displayName}`}</Link>
          <p>{excerpt}</p>
          {/* <img src={imageURL} /> */}
          <p>{new Date(date).toLocaleDateString()}</p>
        </div>
      )
    })
  }

  return 'No blog posts!'
}

Posts.getInitialProps = async () => {
  const posts = await app.content.get({ schemaKey: 'blogPost', populate: true })
  const filteredPosts = await Promise.all(
    Object.values(posts || {})
      .filter(post => post.status === 'published')
      .sort((postA, postB) => {
        const dateA = new Date(postA.date)
        const dateB = new Date(postB.date)

        if (dateA < dateB) return -1
        if (dateA > dateB) return 1
        return 0
      })
      .map(async post => {
        // const { image } = post
        // const [postImage] = image
        // const url = await app.storage.getURL({ fileId: postImage.id })
        // post.imageURL = url
        return post
      })
  )
  console.log(filteredPosts)
  return {
    posts: filteredPosts,
  }
}

export default Posts
