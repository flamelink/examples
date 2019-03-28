import React, { PureComponent } from 'react'
import Markdown from 'markdown-to-jsx'
import PropTypes from 'prop-types'
import NextError from 'next/error'
import { flamelinkApp as app } from '../../utils/flamelink'
import { getImageAlt, getDateString } from '../../utils/post/post.util'
import { DEFAULT_POST_IMAGE_URL } from '../../constants/constants'
import { containerInner } from '../../components/styled'

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

    this._subscription = app.content.subscribe({
      schemaKey: 'blogPost',
      changeType: 'modified',
      filters: [['slug', '==', slug]],
      fields: Post.fields,
      populate: Post.populate,
      size: Post.imageOption,
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
        status,
      } = updatedPost || post

      // Only show published posts
      if (status !== 'published') {
        return <NextError statusCode={404} />
      }

      const { url } = (image && image[0]) || { url: DEFAULT_POST_IMAGE_URL }

      return (
        <>
          <header className="banner">
            <img src={url} alt={getImageAlt(post)} />
            <div className="post-meta">
              <p>{`${getDateString(date)} ${displayName}`}</p>
              <h1>{title}</h1>
            </div>
          </header>
          <div className={containerInner.className}>
            <Markdown>{content}</Markdown>
            <style jsx>{`
              :global(.pageSection) {
                margin-bottom: 4.28rem;
              }

              :global(.banner) {
                width: 100%;
                position: relative;
              }

              :global(.banner > img) {
                width: 100%;
              }

              :global(.post-meta) {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #fff;
              }

              :global(.post-meta > h1) {
                text-shadow: 0px 0px 10px var(--text-color);
              }

              :global(.post-meta > p) {
                text-shadow: 0px 0px 10px var(--text-color);
              }
            `}</style>
            <style jsx>{containerInner}</style>
          </div>
        </>
      )
    }

    return <NextError statusCode={404} />
  }
}

Post.populate = [
  {
    field: 'author',
    fields: ['displayName'],
  },
  'image',
]

Post.imageOption = {
  width: 1080,
}

Post.fields = ['title', 'date', 'content', 'author', 'image', 'status']

Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    author: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
    content: PropTypes.string.isRequired,
    image: PropTypes.array.isRequired,
  }),
}

Post.getInitialProps = async function({ query }) {
  const [post] = Object.values(
    (await app.content.getByField({
      schemaKey: 'blogPost',
      field: 'slug',
      value: query.slug,
      fields: Post.fields,
      populate: Post.populate,
      size: Post.imageOption,
    })) || {}
  )

  return {
    post,
  }
}

export default Post
