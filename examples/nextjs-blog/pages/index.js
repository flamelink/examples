import React, { PureComponent, Fragment } from 'react'
import Slider from 'react-slick'
// import PropTypes from 'prop-types'
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
  }

  // async componentDidMount() {
  //   this._subscription = app.content.subscribe({
  //     schemaKey: 'blogPost',
  //     changeType: 'modified',
  //     filters: [['status', '==', 'published']],
  //     orderBy: {
  //       field: 'date',
  //       order: 'asc',
  //     },
  //     populate: Home.populate,
  //     fields: Home.fields,
  //     callback: (error, response) => {
  //       if (error) {
  //         throw new Error(
  //           'Something went wrong while retrieving all the content. Details:',
  //           error
  //         )
  //       }

  //       const posts = Object.values(response || {})

  //       this.setState({ posts })
  //     },
  //   })
  // }

  // componentWillUnmount() {
  //   this._subscription && this._subscription()
  // }

  renderPostCards() {
    const { posts } = this.props
    const { posts: updatedPosts } = this.state

    return (updatedPosts || posts).map(post => {
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

  renderSuggestedPostSLider() {
    const { suggestedImagesURLs } = this.props

    return (
      <div className="container">
        <Slider
          {...{
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
          }}
        >
          {suggestedImagesURLs.map((imageURL, i) => (
            <div key={imageURL}>
              <img src={imageURL} alt={`Slider post ${i}`} />
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  render() {
    const { posts } = this.props
    const { posts: updatedPosts } = this.state

    if (!posts && !updatedPosts) {
      return <h4>No posts yet :(</h4>
    }

    return (
      <div className={containerWide.className}>
        {this.renderSuggestedPostSLider()}
        <h1>Latest Posts</h1>
        <Grid
          container
          justify="flex-start"
          spacing={32}
          className="pageSection"
        >
          {this.renderPostCards()}
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

          :global(.container) {
            margin: 0 auto;
            padding: 40px;
            width: 80%;
            color: #333;
            background: #419be0;
          }

          h3 {
            background: blue;
            color: #fff;
            font-size: 36px;
            line-height: 100px;
            margin: 10px;
            padding: 2%;
            position: relative;
            text-align: center;
          }
          :global(.variable-width .slick-slide p) {
            background: blue;
            height: 100px;
            color: #fff;
            margin: 5px;
            line-height: 100px;
            text-align: center;
          }
          :global(.center .slick-center h3) {
            color: #e67e22;
            opacity: 1;
            transform: scale(1.08);
          }
          :global(.center h3) {
            opacity: 0.8;
            transition: all 300ms ease;
          }
          :global(.content) {
            padding: 20px;
            margin: auto;
            width: 90%;
          }
          :global(.slick-slide .image) {
            padding: 10px;
          }
          :global(.slick-slide img) {
            border: 5px solid #fff;
            display: block;
            margin: auto;
          }
          :global(.slick-slide img.slick-loading) {
            border: 0;
          }
          :global(.slick-slider) {
            margin: 30px auto 50px;
          }
          :global(.slick-dots) {
            margin-left: 0;
          }
          :global(.slick-thumb) {
            bottom: -45px;
          }
          :global(.slick-thumb li) {
            width: 60px;
            height: 45px;
          }
          :global(.slick-thumb li img) {
            filter: grayscale(100%);
          }
          :global(.slick-thumb li.slick-active img) {
            filter: grayscale(0%);
          }
          :global(.slick-vertical .slick-slide) {
            height: 180px;
          }
          :global(.slick-arrow) {
            background-color: grey;
            /* color: black; */
          }
          :global(.slick-arrow:hover) {
            background-color: grey;
          }
          /* .slick-prev {
            z-index: 100;
            left: 20px !important;
          }
          .slick-next {
            z-index: 100;
            right: 20px !important;
          } */
        `}</style>
        <style jsx>{containerWide}</style>
      </div>
    )
  }
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

Home.propTypes = {}

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

  const suggestedImagesURLs = posts
    .filter(post => post.suggested)
    .map(post => {
      try {
        return post.image[0].url
      } catch (error) {
        return DEFAULT_POST_IMAGE_URL
      }
    })

  console.log(suggestedImagesURLs)

  return {
    posts: posts.slice(0, 4),
    suggestedImagesURLs,
  }
}

export default Home
