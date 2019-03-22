import PropTypes from 'prop-types'
import { flamelinkApp as app } from '../../utils/flamelink'
import { Link } from '../../routes'
import { getImageAlt, getDateString } from '../../utils/post/post.util'
import { DEFAULT_POST_IMAGE_URL } from '../../constants/constants'
import Post from './post'

// todo: subscribe.
const Posts = function(props) {
  const { posts } = props

  if (posts) {
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
        <div key={docId}>
          <Link route={`/blog/${slug}`}>
            {/* href gets added to <a> by <Link> */}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>{`${title} - ${displayName}`}</a>
          </Link>
          <p>{excerpt}</p>
          <p>{getDateString(date)}</p>
          <img src={url} alt={getImageAlt(post)} />
        </div>
      )
    })
  }

  throw new Error('No posts!')
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

// todo: if you can get prop-types to log errors for element misshape 👌, this
// currently doesn't
Post.propTypes = {
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
