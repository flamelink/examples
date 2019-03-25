import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  Card,
  CardActions,
  CardMedia,
  CardContent,
} from '@material-ui/core'
import { flamelinkApp as app } from '../../utils/flamelink'
import { Link } from '../../routes'
import { getImageAlt, getDateString } from '../../utils/post/post.util'
import { DEFAULT_POST_IMAGE_URL } from '../../constants/constants'
import { containerWide } from '../../components/styled'

class Posts extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      posts: null,
    }
  }

  async componentDidMount() {
    this._subscription = app.content.subscribe({
      schemaKey: 'blogPost',
      changeType: 'modified',
      filters: [['status', '==', 'published']],
      orderBy: {
        field: 'date',
        order: 'asc',
      },
      populate: Posts.populate,
      fields: Posts.fields,
      callback: (error, response) => {
        if (error) {
          throw new Error(
            'Something went wrong while retrieving all the content. Details:',
            error
          )
        }

        const posts = Object.values(response || {})

        this.setState({ posts })
      },
    })
  }

  render() {
    const { posts } = this.props
    const { posts: updatedPosts } = this.state

    if (!posts || !updatedPosts) {
      return <h4>No posts yet :(</h4>
    }

    return (
      <div className={containerWide.className}>
        <Grid
          container
          justify="flex-start"
          spacing={32}
          className="pageSection"
        >
          {(updatedPosts || posts).map(post => {
            const {
              title,
              slug,
              author: { displayName },
              excerpt,
              _fl_meta_: { docId },
              image,
              date,
            } = post

            const { url } = (image && image[0]) || {
              url: DEFAULT_POST_IMAGE_URL,
            }

            return (
              <Grid key={docId} item xs={12} md={6} lg={4} xl={3}>
                <Card className="card">
                  <CardMedia
                    className="media"
                    image={url}
                    title={getImageAlt(post)}
                  />
                  <CardContent>
                    <p>{getDateString(date)}</p>
                    <p>{displayName}</p>
                    <Link route={`/blog/${slug}`}>
                      {/* href gets added to <a> by <Link> */}
                      <a>
                        <h4>{title}</h4>
                      </a>
                    </Link>
                    <p>{excerpt}</p>
                  </CardContent>
                  <CardActions>
                    <Link route={`/blog/${slug}`}>
                      <a className="readPost">Read Article</a>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            )
          })}
        </Grid>
        <style jsx>{`
          :global(.media) {
            height: 11.43rem;
          }

          :global(.card) {
            height: 100%;
          }

          :global(.pageSection) {
            margin-bottom: 4.28rem;
          }
        `}</style>
        <style jsx>{containerWide}</style>
      </div>
    )
  }
}

Posts.fields = [
  'title',
  'slug',
  'author',
  'excerpt',
  'image',
  'date',
  '_fl_meta_',
]

Posts.populate = [
  {
    field: 'author',
    fields: ['displayName'],
  },
]

Posts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      author: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
      }).isRequired,
      excerpt: PropTypes.string.isRequired,
      image: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
      date: PropTypes.string.isRequired,
      _fl_meta_: PropTypes.shape({
        docId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
}

Posts.getInitialProps = async () => {
  const posts = Object.values(
    (await app.content.get({
      schemaKey: 'blogPost',
      filters: [['status', '==', 'published']],
      orderBy: {
        field: 'date',
        order: 'asc',
      },
      populate: Posts.populate,
      fields: Posts.fields,
    })) || {}
  )

  return {
    posts,
  }
}

export default Posts
