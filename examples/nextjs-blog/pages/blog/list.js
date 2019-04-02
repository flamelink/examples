import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import NextError from 'next/error'
import { flamelinkApp as app } from '../../utils/flamelink'
import BlogPostsGrid from '../../components/blog-posts-grid'
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
      <BlogPostsGrid posts={updatedPosts || posts} />
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
