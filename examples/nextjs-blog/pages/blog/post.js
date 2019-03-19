import { flamelinkApp as app } from '../../utils/flamelink'
import Markdown from 'markdown-to-jsx'
import PropTypes from 'prop-types'

const Post = function(props) {
  const {
    title,
    date,
    author: { displayName },
    content,
    // image,
  } = props.post

  return (
    <div>
      <h1>{title}</h1>
      <h2>{displayName}</h2>
      <p>{new Date(date).toLocaleDateString()}</p>
      <Markdown>{content}</Markdown>
      {/* <img src={}/> */}
    </div>
  )
}

Post.getInitialProps = async ({ query }) => {
  console.log('SLUG', query.slug)

  const [post] = Object.values(
    (await app.content.getByField({
      schemaKey: 'blogPost',
      field: 'slug',
      value: query.slug,
      populate: true,
    })) || {}
  )

  console.log(post)

  return {
    post,
  }
}

Post.propTypes = {
  post: PropTypes.object,
}

export default Post
