const Post = function(props) {
  return <h1>{props.title}</h1>
}

Post.getInitialProps = async ({ query }) => {
  console.log('SLUG', query.slug)
  return {
    title: 'blog post title',
  }
}

export default Post
