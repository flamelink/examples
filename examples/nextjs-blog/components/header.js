import React from 'react'
import Nav from './nav'
import { Link } from '../routes'
import { containerWide } from './styled'

const Header = () => {
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
        <Nav />
      </div>
      <style jsx>{`
        header > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
      <style jsx>{containerWide}</style>
    </header>
  )
}

export default Header
