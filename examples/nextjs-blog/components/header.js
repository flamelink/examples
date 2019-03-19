/**
 * This is a placeholder component - everything can be changed
 */
import React, { useState, useEffect } from 'react'
import { flamelinkApp } from '../utils/flamelink'
import { Link } from '../routes'

const Header = () => {
  const [mainNav, setMainNav] = useState(null)
  const [navError, setNavError] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const nav = await flamelinkApp.nav.get({
          navigationKey: 'mainNav',
          structure: 'nested',
        })

        setMainNav(nav)
      } catch (error) {
        // log error to third party service if applicable
        setNavError(error)
      }
    })()
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
    <nav>
      <ul>
        <li>
          <Link route="/">Home</Link>
        </li>
        <li>
          <Link route="/blog">Blog</Link>
        </li>
        <li>
          <Link route="/authors">Authors</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Header
