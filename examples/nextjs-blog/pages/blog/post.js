import React, { PureComponent } from 'react'
import Markdown from 'markdown-to-jsx'
import PropTypes from 'prop-types'
import { flamelinkApp as app } from '../../utils/flamelink'
import { getImageAlt, getDateString } from '../../utils/post/post.util'
import { DEFAULT_POST_IMAGE_URL } from '../../constants/constants'

class Post extends PureComponent {
  constructor(props) {
    super(props)
    this._subscription = null
    this.state = {
      post: null,
    }
  }

  async componentDidMount() {
    const { pathname } = location
    const slug = pathname.split('/').pop()

    // todo: SDK bug - subscribing using an event type doesn't work
    this._subscription = app.content.subscribe({
      schemaKey: 'blogPost',
      // changeType: 'modified',
      filters: [['slug', '==', slug], ['_fl_meta_.locale', '==', 'en-US']],
      // fields: Post.fields,
      populate: Post.populate,
      callback: (error, response) => {
        if (error) {
          throw new Error(
            'Something went wrong while retrieving all the content. Details:',
            error
          )
        }

        const [post] = Object.values(response || {})

        this.setState({ post })
      },
    })
  }

  componentWillUnmount() {
    // unsubscribe
    if (this._subscription) this._subscription()
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
        image,
      } = updatedPost || post

      const { url } = (image && image[0]) || { url: DEFAULT_POST_IMAGE_URL }

      return (
        <div>
          <h1>{title}</h1>
          <h2>{displayName}</h2>
          <p>{getDateString(date)}</p>
          <Markdown>{content}</Markdown>
          <img src={url} alt={getImageAlt(post)} />
        </div>
      )
    }

    throw new Error('No post!')
  }
}

Post.populate = [
  {
    field: 'author',
    fields: ['displayName'],
  },
]

Post.fields = ['title', 'date', 'content', 'author', 'image']

Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    author: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
    content: PropTypes.string.isRequired,
    image: PropTypes.array.isRequired,
  }),
}

Post.getInitialProps = async function({ query }) {
  // todo: SDK bug: fields is not respected
  const [post] = Object.values(
    (await app.content.getByField({
      schemaKey: 'blogPost',
      field: 'slug',
      value: query.slug,
      // fields: Post.fields,
      populate: Post.populate,
    })) || {}
  )

  console.log(post)

  return {
    post,
  }
}

export default Post
