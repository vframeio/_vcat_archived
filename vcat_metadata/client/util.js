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

// Use to pad frame numbers with zeroes
export const pad = (n, m) => {
  let s = String(n || 0)
  while (s.length < m) {
    s = '0' + s
  }
  return s
}

// Verified is 0/1 when retrieved from SQL, but 'verified' or 'unverified' when retrieved elsewhere
export const isVerified = verified => verified === 1 || verified === '1' || verified === 'verified'
export const verify = verified => isVerified(verified) ? 'verified' : 'unverified'

export const courtesyS = (n, s) => n + ' ' + (n === 1 ? s : s + 's')

export const padSeconds = n => n < 10 ? '0' + n : n

export const timestamp = (n = 0, fps = 25) => {
  n /= fps
  let s = padSeconds(Math.round(n) % 60)
  n = Math.floor(n / 60)
  if (n > 60) {
    return Math.floor(n / 60) + ':' + padSeconds(n % 60) + ':' + s
  }
  return (n % 60) + ':' + s
}

export const percent = n => (n * 100).toFixed(1) + '%'

export const px = (n, w) => Math.round(n * w) + 'px'

export const clamp = (n, a, b) => n < a ? a : n < b ? n : b

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

export const imageUrl = (verified, sha256, frame, size = 'th') => [
  'https://' + process.env.S3_HOST + '/v1/media/keyframes',
  isVerified(verified) ? null : 'unverified',
  hashPath(sha256),
  pad(frame, 6),
  size,
  'index.jpg'
].filter(s => !!s).join('/')

export const metadataUri = (sha256, tag) => '/metadata/' + sha256 + '/' + tag + '/'
export const keyframeUri = (sha256, frame) => '/metadata/' + sha256 + '/keyframe/' + pad(frame, 6) + '/'

/* AJAX */

let cachedAuth = null
let token = ''
let username = ''

export const post = (uri, data, credentials) => {
  login()
  let headers
  if (data instanceof FormData) {
    headers = {
      Accept: 'application/json, application/xml, text/play, text/html, *.*',
    }
  } else {
    headers = {
      Accept: 'application/json, application/xml, text/play, text/html, *.*',
      'Content-Type': 'application/json; charset=utf-8',
    }
    data = JSON.stringify(data)
  }
  let opt = {
    method: 'POST',
    body: data,
    headers,
    credentials: 'include',
  }
  if (credentials) {
    headers.Authorization = 'Token ' + token
  }
  // console.log(headers)
  // headers['X-CSRFToken'] = csrftoken
  return fetch(uri, opt).then(res => res.json())
}

// api queries
export const login = () => {
  if (cachedAuth) return cachedAuth
  const isLocal = (window.location.hostname === '0.0.0.0' || window.location.hostname === '127.0.0.1')
  try {
    const auth = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).auth)
    // console.log('auth', auth)
    token = auth.token
    username = auth.user.username
    if (token) {
      console.log('logged in', username)
    }
    cachedAuth = auth
    if (!token && !isLocal) {
      window.location.href = '/'
    }
    return auth    
  } catch (e) {
    if (!isLocal) {
      window.location.href = '/'
    }
    return {}
  }
}
