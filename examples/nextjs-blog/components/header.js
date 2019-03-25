import React, { useState, useEffect } from 'react'
import { flamelinkApp } from '../utils/flamelink'
import { Link } from '../routes'
import { containerWide } from './styled'

const Header = () => {
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
    <header>
      <div className={containerWide.className}>
        <h2>
          <Link route="/">
            <a>
              <strike>Example</strike> Blog
            </a>
          </Link>
        </h2>
        <nav>
          <ul>
            {mainNav.items.map(item => (
              <li key={item.uuid} className={item.cssClass}>
                <Link route={item.url}>
                  <a target={item.newWindow ? '_blank' : '_self'}>
                    {item.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <style jsx>{`
        header > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

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

        li:hover {
          border-bottom-color: var(--primary-color);
        }
      `}</style>
      <style jsx>{containerWide}</style>
    </header>
  )
}

export default Header
