import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { flamelinkApp as app } from '../../utils/flamelink'
import { Link } from '../../routes'

class Authors extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      authors: null,
      loading: true,
    }
  }

  UNSAFE_componentWillMount() {
    this._subscription = app.users.subscribe({
      callback: (error, response) => {
        if (error) {
          throw new Error(
            'Something went wrong while retrieving all users. Details:',
            error
          )
        }

        this.setState({ authors: response })
      },
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription()
  }

  render() {
    const { authors } = this.props
    const { authors: updatedAuthors } = this.state

    if (!authors || !updatedAuthors) {
      return 'No users!'
    }

    return Object.values(updatedAuthors || authors).map(author => (
      <h3 key={author.id}>
        <Link route={`/authors/${author.id}`}>{author.displayName}</Link>
      </h3>
    ))
  }
}

Authors.getInitialProps = async () => {
  const authors = await app.users.get()

  return {
    authors,
  }
}

Authors.propTypes = {
  authors: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
}

Authors.propTypes = {
  authors: function(props, propName) {
    const authors = props[propName]

    for (const authorKey in authors) {
      const author = authors[authorKey]

      if (
        typeof author.id !== 'string' ||
        typeof author.displayName !== 'string'
      ) {
        return new Error('Validation failed!')
      }
    }
  },
}

export default Authors
