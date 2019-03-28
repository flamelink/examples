import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import NextError from 'next/error'
import get from 'lodash/get'
import { flamelinkApp as app } from '../../utils/flamelink'

const Profile = props => {
  const [error, setError] = useState(null)
  const [updatedUser, setUser] = useState(null)

  useEffect(() => {
    const { pathname } = location
    const id = pathname.split('/').pop()

    return app.users.subscribe({
      uid: id,
      callback: (err, response) => {
        if (err) {
          setUser(null)
          return setError(err)
        }

        setError(null)
        return setUser(response)
      },
    })
  }, [])

  const { user } = props

  if (error || (!user && !updatedUser)) {
    return <NextError statusCode={get(error, 'code', 404)} />
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

Profile.getInitialProps = async ({ query }) => {
  const user = await app.users.get({ uid: query.id })

  return {
    user,
  }
}

export default Profile
