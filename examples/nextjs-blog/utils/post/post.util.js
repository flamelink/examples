import { flamelinkApp as app } from '../flamelink'

export function getPostsWithMedia(posts = []) {
  return (
    posts &&
    posts.map(async post => {
      const [image] = post.image
      const { id } = image
      const url = await app.storage.getURL({ fileId: id })

      post.imageURL = url

      return post
    })
  )
}

export function getImageAlt(post) {
  const {
    title,
    author: { displayName },
  } = post

  return `${title} by ${displayName}`
}
