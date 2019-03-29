import { format } from 'date-fns'
import { firestoreService } from '../flamelink'

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

export function getDateFromTimestamp(timestamp = {}) {
  // TODO: Confirm what the best way is to get a date from a timestamp object (not instance)
  return firestoreService.Timestamp.fromMillis(
    (timestamp._seconds || timestamp.seconds) * 1000
  ).toDate()
}
