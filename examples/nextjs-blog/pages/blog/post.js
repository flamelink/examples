import React from 'react'
import Markdown from 'markdown-to-jsx'
import PropTypes from 'prop-types'
import { flamelinkApp as app } from '../../utils/flamelink'
import { getPostsWithMedia, getImageAlt } from '../../utils/post/post.util'

const Post = function(props = {}) {
  const { post } = props

  if (post) {
    const {
      title,
      date,
      author: { displayName },
      content,
      imageURL,
    } = post

    return (
      <div>
        <h1>{title}</h1>
        <h2>{displayName}</h2>
        <p>{new Date(date).toLocaleDateString()}</p>
        <Markdown>{content}</Markdown>
        <img src={imageURL} alt={getImageAlt(post)} />
      </div>
    )
  }

  return 'No post data!'
}

Post.getInitialProps = async ({ query }) => {
  console.log('SLUG', query.slug)

  const [post] = await Promise.all(
    getPostsWithMedia(
      Object.values(
        (await app.content.getByField({
          schemaKey: 'blogPost',
          field: 'slug',
          value: query.slug,
          populate: true,
        })) || {}
      )
    )
  )

  return {
    post,
  }
}

Post.propTypes = {
  post: PropTypes.object,
}

export default Post
