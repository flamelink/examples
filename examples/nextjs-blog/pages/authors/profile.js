import React, { PureComponent } from 'react'
import { flamelinkApp as app } from '../../utils/flamelink'
import PropTypes from 'prop-types'

class Profile extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
    }
  }

  async componentDidMount() {
    const { pathname } = location
    const id = pathname.split('/').pop()

    this._subscription = app.users.subscribe({
      uid: id,
      callback: (error, response) => {
        if (error) {
          throw new Error(
            'Something went wrong while retrieving user. Details:',
            error
          )
        }

        this.setState({ user: response })
      },
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription()
  }

  render() {
    const { user } = this.props
    const { user: updatedUser } = this.state

    if (!user || !updatedUser) {
      return 'No user data'
    }

    const { displayName, email, enabled, id } = updatedUser || user

    return (
      <div>
        <h1>{displayName}</h1>
        <h2>{email}</h2>
        <h4>{`Enabled: ${enabled}`}</h4>
        <h4>{id}</h4>
      </div>
    )
  }
}

Profile.getInitialProps = async ({ query }) => {
  const { id } = query
  const user = await app.users.get({ uid: id })

  return {
    user,
  }
}

Profile.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    enabled: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    permissions: PropTypes.object.isRequired,
  }).isRequired,
}

export default Profile
