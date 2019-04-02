import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import Carousel from 'nuka-carousel'
import Markdown from 'markdown-to-jsx'
import get from 'lodash/get'
import { flamelinkApp as app } from '../utils/flamelink'
import { Link } from '../routes'
import { containerWide } from '../components/styled'
import Slider from '../components/slider'
import BlogPostsGrid from '../components/blog-posts-grid'

class Home extends PureComponent {
  state = {
    posts: null,
    home: null,
  }

  async componentDidMount() {
    this._postsSubscription = await Home.getPostData(
      true,
      (error, response) => {
        if (error) {
          throw new Error(
            'Something went wrong while retrieving posts. Details:',
            error
          )
        }

        const posts = Object.values(response || {})

        this.setState({ posts })
      }
    )

    this._homeSubscription = Home.getHomeData(true, (error, response) => {
      if (error) {
        throw new Error(
          'Something went wrong while retrieving home data. Details:',
          error
        )
      }

      const [home] = Object.values(response || {})

      this.setState({ home })
    })
  }

  componentWillUnmount() {
    this._postsSubscription && this._postsSubscription()
    this._homeSubscription && this._homeSubscription()
  }

  renderSuggestedPostSlider(suggestedPosts) {
    return (
      <Carousel
        cellAlign="center"
        heightMode="max"
        wrapAround={true}
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
    let { posts: updatedPosts, home: updatedHome } = this.state

    const hasPosts = posts || updatedPosts

    const sliderItems = get(
      updatedHome,
      'suggestedPost',
      get(home, 'suggestedPost'),
      []
    ).map(suggestedPost => {
      const { image, post } = suggestedPost
      const { slug, title } = post[0]

      return {
        key: slug,
        link: `/blog/${slug}`,
        title,
        url: get(image, `[0].url`, ''),
      }
    })

    return (
      <Fragment>
        <Slider items={sliderItems} />
        <div className={containerWide.className}>
          <Markdown>
            {get(updatedHome, 'content', get(home, 'content', null))}
          </Markdown>
          {hasPosts && (
            <Fragment>
              <h2>Latest Posts</h2>
              <BlogPostsGrid posts={updatedPosts || posts} />
            </Fragment>
          )}
          <style jsx>{containerWide}</style>
        </div>
      </Fragment>
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
    Object.assign(options, { callback: cb })

    return app.content.subscribe(options)
  }

  return Object.values((await app.content.get(options)) || {})
}

Home.getHomeData = function(subscribe = false, cb = function() {}) {
  const options = {
    schemaKey: 'home',
    populate: Home.populate.home,
    size: Home.sizes.posts,
    fields: Home.fields.home,
  }

  if (subscribe) {
    Object.assign(options, { callback: cb })

    return app.content.subscribe(options)
  }

  return app.content.get(options)
}

Home.getInitialProps = async () => {
  return {
    posts: await Home.getPostData(),
    home: await Home.getHomeData(),
  }
}

export default Home
