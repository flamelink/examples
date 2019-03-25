import React from 'react'
import { containerWide } from './styled'
import Icon from './icon'
import { socialLinks } from '../utils/links'

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer>
      <div className={containerWide.className}>
        <span className="copyright">
          &copy; {year} Example Blog{' '}
          <a href="https://flamelink.io">by Flamelink</a>
        </span>
        <nav>
          <ul>
            {socialLinks.map(link => (
              <li key={link.title}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  title={link.title}
                >
                  <Icon icon={link.icon} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <style jsx>{`
        footer {
          background-color: var(--footer-bg-color);
          color: var(--footer-text-color);
          padding: 4.14rem;
        }

        footer > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .copyright {
          font-size: 0.8rem;
        }

        .copyright > a {
          font-weight: 300;
          color: inherit;
        }

        .copyright > a:hover {
          text-decoration: underline;
        }

        ul {
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        li {
          margin-left: 1rem;
        }

        li:first-child {
          margin-left: 0;
        }

        li:hover path {
          fill: var(--primary-color);
        }
      `}</style>
      <style jsx>{containerWide}</style>
    </footer>
  )
}

export default Footer
