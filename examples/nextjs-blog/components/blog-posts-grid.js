import PropTypes from 'prop-types'
import {
  Grid,
  Card,
  CardActions,
  CardMedia,
  CardContent,
} from '@material-ui/core'
import get from 'lodash/get'
import { Link } from '../routes'
import { DEFAULT_POST_IMAGE_URL } from '../constants/constants'
import { getImageAlt, getDateString } from '../utils/post/post.util'

const BlogPostsGrid = props => {
  return (
    <>
      <Grid container justify="flex-start" spacing={32} className="pageSection">
        {get(props, 'posts', []).map(post => {
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
    </>
  )
}

BlogPostsGrid.propTypes = {
  posts: PropTypes.array.isRequired,
}

export default BlogPostsGrid
