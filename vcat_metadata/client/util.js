/* Mobile check */

export const isiPhone = !!((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)))
export const isiPad = !!(navigator.userAgent.match(/iPad/i))
export const isAndroid = !!(navigator.userAgent.match(/Android/i))
export const isMobile = isiPhone || isiPad || isAndroid
export const isDesktop = !isMobile

const htmlClassList = document.body.parentNode.classList
htmlClassList.add(isDesktop ? 'desktop' : 'mobile')

/* Default image dimensions */

export const widths = {
  th: 160,
  sm: 320,
  md: 640,
  lg: 1280,
}

/* Formatting functions */

const acronyms = 'id url cc sa fp md5 sha256'.split(' ').map(s => '_' + s)
const acronymsUpperCase = acronyms.map(s => s.toUpperCase())

export const formatName = s => {
  acronyms.forEach((acronym, i) => s = s.replace(acronym, acronymsUpperCase[i]))
  return s.replace(/_/g, ' ')
}

export const pad = (n, m) => {
  let s = String(n || 0)
  while (s.length < m) {
    s = '0' + s
  }
  return s
}

export const courtesyS = (n, s) => n + ' ' + (n === 1 ? s : s + 's')

export const padSeconds = n => n < 10 ? '0' + n : n

export const timestamp = (n = 0, fps = 25) => {
  n /= fps
  let s = padSeconds((n % 60).toFixed(1))
  n = Math.floor(n / 60)
  if (n > 60) {
    return Math.floor(n / 60) + ':' + padSeconds(n % 60) + '\'' + s + '\"'
  }
  return (n % 60) + '\'' + s + '"'
}

export const percent = n => (n * 100).toFixed(1) + '%'

export const px = (n, w) => Math.round(n * w) + 'px'

/* URLs */

export const hashPath = sha256 => {
  if (!sha256 || sha256.length < 9) {
    throw new Error('Invalid sha256')
  }
  return [
    sha256.slice(0, 3),
    sha256.slice(3, 6),
    sha256.slice(6, 9),
    sha256,
  ].join('/')
}

export const imageUrl = (sha256, frame, size = 'th') => [
  'https://' + process.env.S3_HOST + '/v1/media/keyframes',
  hashPath(sha256),
  pad(frame, 6),
  size,
  'index.jpg'
].join('/')

export const metadataUri = (sha256, tag) => '/metadata/' + sha256 + '/' + tag + '/'
export const keyframeUri = (sha256, frame) => '/metadata/' + sha256 + '/keyframe/' + pad(frame, 6) + '/'
