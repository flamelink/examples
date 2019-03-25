import React from 'react'
import PropTypes from 'prop-types'

const StyledIcon = ({ icon: Icon }) => {
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

StyledIcon.propTypes = {
  icon: PropTypes.func.isRequired,
}

export default StyledIcon
