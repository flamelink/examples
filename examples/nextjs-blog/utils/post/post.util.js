import { format } from 'date-fns'

export function getImageAlt(post) {
  const {
    title,
    author: { displayName },
  } = post

  return `${title} by ${displayName}`
}

export function getDateString(timeStampWithZone) {
  const datetime = new Date(timeStampWithZone)

  return format(datetime, 'DD MMMM YYYY')
}
