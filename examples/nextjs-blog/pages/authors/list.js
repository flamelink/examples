import { Link } from '../../routes'

const Authors = function(props) {
  return Object.values(props.posts).map(post => (
    <h3>
      <Link route={`/authors/${post.id}`}>{post.fullName}</Link>
    </h3>
  ))
}

Authors.getInitialProps = async ({ query }) => {
  return {
    posts: {
      author1: { fullName: 'JP Erasmus', id: 'asd1' },
      author2: { fullName: 'Jordan Hunt', id: 'asd2' },
      author3: { fullName: 'De Wet vd Merwe', id: 'asd3' },
    },
  }
}

export default Authors
