import React, { useState, useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'next/router'
import { flamelinkApp } from '../utils/flamelink'
import { Link } from '../routes'

const Nav = ({ router }) => {
  const [mainNav, setMainNav] = useState(null)
  const [navError, setNavError] = useState(null)

  useEffect(() => {
    return flamelinkApp.nav.subscribe({
      navigationKey: 'mainNav',
      structure: 'nested',
      callback(error, nav) {
        if (error) {
          // log error to third party service if applicable
          return setNavError(error)
        }

        return setMainNav(nav)
      },
    })
  }, [])

  if (navError) {
    return (
      <p style={{ color: 'red', textAlign: 'center' }}>{navError.message}</p>
    )
  }

  if (!mainNav) {
    return null
  }

  return (
    <Fragment>
      <nav>
        <ul>
          {mainNav.items.map(item => (
            <li
              key={item.uuid}
              className={[
                item.cssClass,
                router.asPath === item.url ? 'active' : '',
              ].join(' ')}
            >
              <Link route={item.url}>
                <a target={item.newWindow ? '_blank' : '_self'}>{item.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <style jsx>{`
        ul {
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        li {
          margin-left: 2.14rem;
          font-size: 1.14rem;
          transition: all 0.2s ease;
        }

        li:not(.button) {
          border-bottom: 1px solid transparent;
        }

        li:first-child {
          margin-left: 0;
        }

        li:hover,
        li.active {
          border-bottom-color: var(--primary-color);
        }
      `}</style>
    </Fragment>
  )
}

Nav.propTypes = {
  router: PropTypes.object.isRequired,
}

export default withRouter(Nav)
