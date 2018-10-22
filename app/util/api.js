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

export const image_endpoint = "https://" + site.s3.bucket + "." + site.s3.region + ".digitaloceanspaces.com"
export const keyframe_endpoint = [image_endpoint, 'v1', 'media', 'keyframes'].join('/')
export const keyframe_endpoint_unverified = [keyframe_endpoint, 'unverified'].join('/')

// generate the three-level hash used by vframe v1 keyframe datastore api
export const hash_dir = (hash) => {
  return [
    hash.substr(0, 3),
    hash.substr(3, 3),
    hash.substr(6, 3),
    hash,
  ].join('/')
}

// size can be: th, sm, md, lg
export const image_url = (img, type, size) => {
  if (! img.id) {
    return "/static/vframe-logo-blue.png"
  }
  size = size || 'md'
  if (img.from_sa && img.fn === 'index') {
    const endpoint = img.verified ? keyframe_endpoint : keyframe_endpoint_unverified
    if (img.frame) {
      return [
        endpoint,
        hash_dir(img.sa_hash),
        pad(img.frame, 6),
        size,
        'index.jpg'
      ].join('/')
    }
    return [
      endpoint,
      hash_dir(img.sa_hash),
      size,
      'index.jpg'
    ].join('/')
  }
  return [image_endpoint, "media", type, img.id, img.fn, size + ".jpg"].join('/')
}

// Use to pad frame numbers with zeroes
export const pad = (n, m) => {
  let s = String(parseInt(n, 10) || 0)
  while (s.length < m) {
    s = '0' + s
  }
  return s
}

