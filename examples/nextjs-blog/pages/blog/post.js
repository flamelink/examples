import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Markdown from 'markdown-to-jsx'
import NextError from 'next/error'
import NextSeo, { ArticleJsonLd } from 'next-seo'
import { flamelinkApp as app } from '../../utils/flamelink'
import {
  getImageAlt,
  getDateString,
  getDateFromTimestamp,
} from '../../utils/post/post.util'
import { DEFAULT_POST_IMAGE_URL } from '../../constants/constants'
import { containerInner } from '../../components/styled'

const Post = props => {
  const [error, setError] = useState(null)
  const [updatedPost, setPost] = useState(null)

  useEffect(() => {
    const { pathname } = location
    const slug = pathname.split('/').pop()

    return app.content.subscribe({
      schemaKey: 'blogPost',
      changeType: 'modified',
      filters: [['slug', '==', slug]],
      fields: Post.fields,
      populate: Post.populate,
      callback: (err, response) => {
        if (err) {
          setPost(null)
          return setError(err)
        }

        const [content] = Object.values(response || {})

        setError(null)
        return setPost[content]
      },
    })
  }, [])

  const { post } = props

  if (updatedPost || post) {
    const {
      title,
      date,
      author,
      content,
      image,
      status,
      seo,
      tags,
      _fl_meta_: { createdDate, lastModifiedDate },
    } = updatedPost || post

    const { displayName } = author

    // Only show published posts
    if (status !== 'published') {
      return <NextError statusCode={404} />
    }

    const postImage = (image && image[0]) || { url: DEFAULT_POST_IMAGE_URL }
    const { url } = postImage

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
        <NextSeo
          config={{
            title: `${seo.ogTitle || seo.metaTitle || title} | Post`,
            description: seo.metaDescription,
            openGraph: {
              title: `${seo.ogTitle || seo.metaTitle || title} | Post`,
              description: seo.ogDescription || seo.metaDescription,
              url:
                seo.ogUrl || seo.canonicalUrl || typeof window !== 'undefined'
                  ? window.location.href
                  : '',
              type: seo.ogType || 'article',
              article: {
                publishedTime: getDateFromTimestamp(createdDate).toISOString(),
                modifiedTime: getDateFromTimestamp(
                  lastModifiedDate
                ).toISOString(),
                section: 'Section II',
                authors: [
                  `${
                    typeof window !== 'undefined' ? window.location.origin : ''
                  }/authors/${author.id}`,
                ],
                tags,
              },
              images: [
                {
                  url: seo.ogImage || url,
                  alt: seo.ogTitle || title,
                },
              ],
            },
          }}
        />
        <ArticleJsonLd
          url={url}
          title={seo.metaTitle || title}
          images={[url]}
          datePublished={getDateFromTimestamp(createdDate).toISOString()}
          dateModified={getDateFromTimestamp(lastModifiedDate).toISOString()}
          authorName={displayName}
          publisherName="Flamelink"
          publisherLogo="https://www.example.com/photos/logo.jpg"
          description={seo.metaDescription}
        />
      </>
    )
  }

  return <NextError statusCode={get(error, 'code', 404)} />
}

Post.populate = [
  {
    field: 'author',
    fields: ['displayName', 'id'],
  },
  'image',
]

Post.fields = [
  '_fl_meta_',
  'title',
  'date',
  'content',
  'author',
  'image',
  'status',
  'seo',
  'tags',
]

Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    author: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
    content: PropTypes.string.isRequired,
    image: PropTypes.array.isRequired,
    seo: PropTypes.object.isRequired,
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
    })) || {}
  )

  return {
    post,
  }
}

export default Post
