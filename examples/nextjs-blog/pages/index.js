import React from 'react'
import Carousel from 'nuka-carousel'
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

const Home = function(props) {
  function renderPostCards(posts) {
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

  function renderSuggestedPostSlider(suggestedPosts) {
    return (
      <Carousel
        cellAlign="left"
        heightMode="max"
        wrapAround={false}
        slidesToScroll={1}
      >
        {suggestedPosts.map(post => {
          const { title, url, slug } = post

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

  const { posts, suggestedPosts } = props

  if (!posts) {
    return <h4>No posts yet :(</h4>
  }

  return (
    <div className={containerWide.className}>
      {renderSuggestedPostSlider(suggestedPosts)}
      <h1>Latest Posts</h1>
      <Grid container justify="flex-start" spacing={32} className="pageSection">
        {renderPostCards(posts)}
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

Home.fields = [
  'title',
  'slug',
  'author',
  'image',
  'date',
  '_fl_meta_',
  'suggested',
]

Home.populate = [
  {
    field: 'author',
    fields: ['displayName'],
  },
]

Home.propTypes = {
  posts: PropTypes.array.isRequired,
  suggestedPosts: PropTypes.array.isRequired,
}

Home.getInitialProps = async () => {
  const posts =
    Object.values(
      await app.content.get({
        schemaKey: 'blogPost',
        filters: [['status', '==', 'published']],
        orderBy: {
          field: 'date',
          order: 'asc',
        },
        populate: Home.populate,
        fields: Home.fields,
      })
    ) || {}

  const suggestedPosts = posts
    .filter(post => post.suggested)
    .map(post => {
      try {
        return {
          url: post.image[0].url,
          slug: post.slug,
          title: post.title,
        }
      } catch (error) {
        console.error(error)

        return {
          url: DEFAULT_POST_IMAGE_URL,
          slug: post.slug,
          title: post.title,
        }
      }
    })

  return {
    posts: posts.slice(0, 4),
    suggestedPosts,
  }
}

export default Home
