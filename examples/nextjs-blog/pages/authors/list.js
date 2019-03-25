import { flamelinkApp as app } from '../../utils/flamelink'
import { Link } from '../../routes'

const Authors = function(props = {}) {
  const { authors } = props
  return Object.values(authors).map(author => (
    <h3 key={author.id}>
      <Link route={`/authors/${author.id}`}>{author.displayName}</Link>
    </h3>
  ))
}

Authors.getInitialProps = async () => {
  const authors = await app.users.get()

  return {
    authors,
  }
}

export default Authors
