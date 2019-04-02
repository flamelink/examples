import PropTypes from 'prop-types'
import Carousel from 'nuka-carousel'
import get from 'lodash/get'
import { Link } from '../routes'

const Slider = props => {
  return (
    <>
      <Carousel
        cellAlign="center"
        heightMode="max"
        slidesToScroll={1}
        width="100%"
        wrapAround
        enableKeyboardControls
        autoplay
        pauseOnHover
      >
        {get(props, 'items', []).map(({ link, url, title, key }) => {
          return (
            <div key={key}>
              <Link route={link}>
                <img src={url} alt={title} />
              </Link>
            </div>
          )
        })}
      </Carousel>
      <style jsx>{`
        div {
          width: 100%;
          height: 30rem;
          text-align: center;
          overflow: hidden;
        }

        img {
          max-width: 100%;
          max-height: 30rem;
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}

Slider.propTypes = {
  items: PropTypes.array.isRequired,
}

export default Slider
