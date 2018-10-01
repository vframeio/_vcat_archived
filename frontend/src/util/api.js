import { site } from './site'

export const URL = process.env.API_URL
export const GET_TOKEN = "/api-token-auth/"
export const SIGNUP = "/accounts/signup/"
export const USER = "/api/users/"
export const CURRENT_USER = "/api/users/current/"

export const hierarchyImage = "/api/hierarchy/image/"
export const hierarchy = "/api/hierarchy/"
export const editor = "/api/editor/"
export const images = "/api/images/"
export const imageGroup = "/api/images/group/"
export const imageRegion = "/api/editor/image/region/"

export const videos = {
  index: "/api/videos/",
  create: "/api/videos/",
  update: "/api/videos/",
  destroy: "/api/videos/",
}

// export const visualguide = "https://files.vframe.io/syrian_archive_visual_guide/"

export const image_uploads = "https://" + site.s3.bucket + "." + site.s3.region + ".digitaloceanspaces.com/media"

// size can be: th, sm, md, lg
export const image_url = (img, type, size) => {
  if (! img.id) {
    return "/static/vframe-logo-blue.png"
  }
  size = size || 'md'
  if (img.base_href) {
    if (img.frame) {
      return [img.base_href, img.sa_hash, img.frame, size, 'index.jpg'].join('/')
    }
    return [img.base_href, img.sa_hash, size, 'index.jpg'].join('/')
  }
  return [image_uploads, type, img.id, img.fn, size + ".jpg"].join('/')
}
