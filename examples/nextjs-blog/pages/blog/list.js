import { Link } from '../../routes'

const Posts = function(props) {
  return Object.values(props.posts).map(post => (
    <h3>
      <Link route={`/blog/${post.slug}`}>{post.title}</Link>
    </h3>
  ))
}

Posts.getInitialProps = async ({ query }) => {
  return {
    posts: {
      post1: { title: 'Post 1', slug: 'post-1' },
      post2: { title: 'Post 2', slug: 'post-2' },
      post3: { title: 'Post 3', slug: 'post-3' },
    },
  }
}

export default Posts
