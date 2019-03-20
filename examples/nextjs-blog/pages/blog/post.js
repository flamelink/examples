import React, { PureComponent } from 'react'
import Markdown from 'markdown-to-jsx'
import PropTypes from 'prop-types'
import { flamelinkApp as app } from '../../utils/flamelink'
import {
  getPostsWithMedia,
  getImageAlt,
  getDateString,
} from '../../utils/post/post.util'

class Post extends PureComponent {
  constructor(props) {
    super(props)
    this._subscription = null
    this.state = {
      post: null,
    }
  }

  componentDidMount() {
    // todo: this isn't so lekker because the path may change in future. is it
    // possible to share the `query.slug` value from the server's execution with
    // the client?
    const { pathname } = location
    const slug = pathname.replace('/blog/', '')

    this._subscription = app.content.subscribe({
      schemaKey: 'blogPost',
      changeType: 'modified',
      filters: [['slug', '==', slug]],
      populate: true,
      callback: async (error, response) => {
        if (error) {
          throw new Error(
            'Something went wrong while retrieving all the content. Details:',
            error
          )
        }

        const [post] = await Promise.all(
          getPostsWithMedia(Object.values(response || {}))
        )

        this.setState({ post })
      },
    })
  }

  componentWillUnmount() {
    // unsubscribe
    this._subscription()
  }

  render() {
    const { post } = this.props
    const { post: updatedPost } = this.state

    if (updatedPost || post) {
      const {
        title,
        date,
        author: { displayName },
        content,
        imageURL,
      } = updatedPost || post

      return (
        <div>
          <h1>{title}</h1>
          <h2>{displayName}</h2>
          <p>{getDateString(date)}</p>
          <Markdown>{content}</Markdown>
          <img src={imageURL} alt={getImageAlt(post)} />
        </div>
      )
    }

    throw new Error('No post!')
  }
}

Post.propTypes = {
  post: PropTypes.object,
}

Post.getInitialProps = async function({ query }) {
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

export default Post
