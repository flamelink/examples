import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  Card,
  CardActions,
  CardMedia,
  CardContent,
} from '@material-ui/core'
import get from 'lodash/get'
import NextError from 'next/error'
import { flamelinkApp as app } from '../../utils/flamelink'
import { Link } from '../../routes'
import { getImageAlt, getDateString } from '../../utils/post/post.util'
import { DEFAULT_POST_IMAGE_URL } from '../../constants/constants'
import { containerWide } from '../../components/styled'

const Posts = props => {
  const [error, setError] = useState(null)
  const [updatedPosts, setPosts] = useState(null)

  useEffect(() => {
    return app.content.subscribe({
      schemaKey: 'blogPost',
      changeType: 'modified',
      filters: [['status', '==', 'published']],
      orderBy: {
        field: 'date',
        order: 'asc',
      },
      populate: Posts.populate,
      fields: Posts.fields,
      size: Posts.postImageOption,
      callback(err, response) {
        if (err) {
          setPosts(null)
          return setError(err)
        }

        const posts = Object.values(response || {})

        setError(null)
        return setPosts(posts)
      },
    })
  })

  const { posts } = props

  if (error) {
    return <NextError statusCode={get(error, 'code', 404)} />
  }

  if (!posts && !updatedPosts) {
    return <h4>No posts yet :(</h4>
  }

  return (
    <div className={containerWide.className}>
      <Grid container justify="flex-start" spacing={32} className="pageSection">
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
                    <a>Read Article</a>
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
  'image',
]

Posts.postImageOption = {
  width: 667,
}

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
      size: Posts.postImageOption,
    })) || {}
  )

  return {
    posts,
  }
}

export default Posts
