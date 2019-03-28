import React, { PureComponent } from 'react'
import Carousel from 'nuka-carousel'
import Markdown from 'markdown-to-jsx'
import PropTypes from 'prop-types'
import {
  Grid,
  Card,
  CardActions,
  CardMedia,
  CardContent,
} from '@material-ui/core'
import { flamelinkApp as app } from '../utils/flamelink'
import { Link } from '../routes'
import { getImageAlt, getDateString } from '../utils/post/post.util'
import { DEFAULT_POST_IMAGE_URL } from '../constants/constants'
import { containerWide } from '../components/styled'

class Home extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      posts: null,
    }
    this._postsSubscription = null
    this._homeSubscription = null
  }

  componentDidMount() {
    this._postsSubscription = Home.getPostData(true, (error, response) => {
      if (error) {
        throw new Error(
          'Something went wrong while retrieving posts. Details:',
          error
        )
      }

      const posts = Object.values(response || {})

      this.setState({ posts })
    })
  }

  componentWillUnmount() {
    this._postsSubscription && this._postsSubscription()
    this._homeSubscription && this._homeSubscription()
  }

  renderPostCards(posts) {
    return posts.map(post => {
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
    })
  }

  renderSuggestedPostSlider(suggestedPosts) {
    return (
      <Carousel
        cellAlign="left"
        heightMode="max"
        wrapAround={false}
        slidesToScroll={1}
      >
        {suggestedPosts.map(suggestedPost => {
          const { image, post } = suggestedPost
          const { url } = image[0]
          const { slug, title } = post[0]
          return (
            <div key={slug}>
              <Link route={`/blog/${slug}`}>
                <img src={url} alt={title} />
              </Link>
            </div>
          )
        })}
      </Carousel>
    )
  }

  render() {
    const { posts, home } = this.props
    let { posts: updatedPosts } = this.state

    if (!posts && !updatedPosts) {
      return <h4>No posts yet :(</h4>
    }

    return (
      <div className={containerWide.className}>
        <Markdown>{home.content}</Markdown>
        {this.renderSuggestedPostSlider(home.suggestedPost)}
        <h2>Latest Posts</h2>
        <Grid
          container
          justify="flex-start"
          spacing={32}
          className="pageSection"
        >
          {this.renderPostCards(updatedPosts || posts)}
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

Home.fields = {
  posts: ['title', 'slug', 'author', 'image', 'date', '_fl_meta_', 'suggested'],
  home: ['content', 'suggestedPost'],
}

Home.propTypes = {
  posts: PropTypes.array.isRequired,
  home: PropTypes.shape({
    content: PropTypes.string.isRequired,
    suggestedPost: PropTypes.array.isRequired,
  }).isRequired,
}

Home.populate = {
  posts: [
    {
      field: 'author',
      fields: ['displayName'],
    },
    'image',
  ],
  home: [
    {
      field: 'suggestedPost',
      subFields: [
        {
          field: 'post',
          // if you wanted to get the nested image from the related post
          // populate: ['image']
        },
        'image',
      ],
    },
  ],
}

Home.sizes = {
  posts: { width: 667 },
  home: { width: 900 },
}

// firestore will not subscribe to a query but instead documents that match the
// original query, to achieve a real-time list of latest posts, we use
// app.content.get in an interval
Home.getPostData = async function(subscribe = false, cb = function() {}) {
  const options = {
    schemaKey: 'blogPost',
    filters: [['status', '==', 'published']],
    orderBy: {
      field: 'date',
      order: 'asc',
    },
    limit: 3,
    populate: Home.populate.posts,
    fields: Home.fields.posts,
    size: Home.sizes.posts,
  }

  if (subscribe) {
    // Object.assign(options, { changeType: 'modified', callback: cb })
    Object.assign(options, { callback: cb })
  }

  return Object.values(
    (await app.content[subscribe ? 'subscribe' : 'get'](options)) || {}
  )
}

Home.getHomeData = function() {
  return app.content.get({
    schemaKey: 'home',
    populate: Home.populate.home,
    size: Home.sizes.posts,
    fields: Home.fields.home,
  })
}

Home.getInitialProps = async () => {
  return {
    posts: await Home.getPostData(),
    home: await Home.getHomeData(),
  }
}

export default Home
