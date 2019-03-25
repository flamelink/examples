import React from 'react'
import PropTypes from 'prop-types'
import FacebookIcon from '../assets/facebook.svg'
import TwitterIcon from '../assets/twitter.svg'
import YoutubeIcon from '../assets/youtube.svg'
import SlackIcon from '../assets/slack.svg'
import GitHubIcon from '../assets/github.svg'

const Icon = ({ icon }) => {
  let Icon

  switch (icon) {
    case 'facebook':
      Icon = FacebookIcon
      break

    case 'twitter':
      Icon = TwitterIcon
      break

    case 'youtube':
      Icon = YoutubeIcon
      break

    case 'slack':
      Icon = SlackIcon
      break

    case 'github':
      Icon = GitHubIcon
      break

    default:
      throw new Error(`No icon imported for "${icon}"`)
  }

  return (
    <i>
      <Icon />
      <style jsx>{`
        i {
          color: #fff;
        }

        i:hover {
          color: var(--primary-color);
        }

        i > svg {
          height: 1.5rem;
          max-width: 1.64rem;
          color: currentColor;
          transition: color 0.4s ease;
        }
      `}</style>
    </i>
  )
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
}

export default Icon
