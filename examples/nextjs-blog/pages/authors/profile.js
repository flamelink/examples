import { flamelinkApp as app } from '../../utils/flamelink'
import PropTypes from 'prop-types'

const Profile = function(props = {}) {
  const { user } = props

  if (!user) {
    return 'No user data'
  }

  const { displayName, email, enabled, id } = user

  return (
    <div>
      <h1>{displayName}</h1>
      <h2>{email}</h2>
      <h4>{`Enabled: ${enabled}`}</h4>
      <h4>{id}</h4>
    </div>
  )
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
  }),
}

export default Profile
