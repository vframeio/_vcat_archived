// import fetchJsonp from 'fetch-jsonp'
import * as types from '../types'
// import { hashPath } from '../util'
import { store, history } from '../store'
import { post, pad, verify } from '../util'
import querystring from 'query-string'

// urls

const url = {
  upload: () => process.env.API_HOST + '/search/api/upload',
  search: () => process.env.API_HOST + '/search/api/fetch',
  searchByVerifiedFrame: (verified, hash, frame) => process.env.API_HOST + '/search/api/search/' + verified + '/' + hash + '/' + pad(frame, 6),
  searchByFrame: (hash, frame) => process.env.API_HOST + '/search/api/search/' + hash + '/' + pad(frame, 6),
  browse: hash => process.env.API_HOST + '/search/api/list/' + hash,
  random: () => process.env.API_HOST + '/search/api/random',
  check: () => process.env.API_HOST + '/api/images/import/search',
}
export const publicUrl = {
  browse: hash => '/search/browse/' + hash,
  searchByVerifiedFrame: (verified, hash, frame) => '/search/keyframe/' + verify(verified) + '/' + hash + '/' + pad(frame, 6),
  searchByFrame: (hash, frame) => '/search/keyframe/' + hash + '/' + pad(frame, 6),
  review: () => '/search/review/'
}

// standard loading events

const loading = (tag, offset) => ({
  type: types.search.loading,
  tag,
  offset
})
const loaded = (tag, data, offset = 0) => ({
  type: types.search.loaded,
  tag,
  data,
  offset
})
const error = (tag, err) => ({
  type: types.search.error,
  tag,
  err
})

// search UI functions

export const panic = () => dispatch => {
  history.push('/search/')
  dispatch({ type: types.search.panic })
}
export const updateOptions = opt => dispatch => {
  dispatch({ type: types.search.update_options, opt })
}

// API functions

export const upload = (file, query) => dispatch => {
  const { options } = store.getState().search
  const tag = 'query'
  const fd = new FormData()
  fd.append('query_img', file)
  fd.append('limit', options.perPage)
  if (!query) {
    dispatch(loading(tag))
  }
  post(url.upload(), fd)
    .then(data => {
      if (query) {
        const { timing } = data.query
        data.query = {
          ...query,
          timing,
        }
      }
      dispatch(loaded(tag, data))
      if (data.query.url && !window.location.search.match(data.query.url)) {
        history.push('/search/?url=' + data.query.url)
      }
    })
    .catch(err => dispatch(error(tag, err)))
}
export const searchByVerifiedFrame = (verified, hash, frame, offset = 0) => dispatch => {
  const { options } = store.getState().search
  const tag = 'query'
  dispatch(loading(tag, offset))
  const qs = querystring.stringify({ limit: options.perPage, offset })
  fetch(url.searchByVerifiedFrame(verified, hash, frame) + '?' + qs, {
    method: 'GET',
    mode: 'cors',
  })
    .then(data => data.json())
    .then(data => dispatch(loaded(tag, data, offset)))
    .catch(err => dispatch(error(tag, err)))
}
export const searchByFrame = (hash, frame, offset = 0) => dispatch => {
  const { options } = store.getState().search
  const tag = 'query'
  dispatch(loading(tag, offset))
  const qs = querystring.stringify({ limit: options.perPage, offset })
  fetch(url.searchByFrame(hash, frame) + '?' + qs, {
    method: 'GET',
    mode: 'cors',
  })
    .then(data => data.json())
    .then(data => dispatch(loaded(tag, data, offset)))
    .catch(err => dispatch(error(tag, err)))
}
export const search = (uri, offset = 0) => dispatch => {
  const { options } = store.getState().search
  const tag = 'query'
  dispatch(loading(tag, offset))
  const qs = querystring.stringify({ url: uri, limit: options.perPage, offset })
  fetch(url.search(uri) + '?' + qs, {
    method: 'GET',
    mode: 'cors',
  })
    .then(data => data.json())
    .then(data => dispatch(loaded(tag, data, offset)))
    .catch(err => dispatch(error(tag, err)))
}
export const browse = hash => dispatch => {
  const tag = 'browse'
  dispatch(loading(tag))
  fetch(url[tag](hash), {
    method: 'GET',
    mode: 'cors',
  })
    .then(data => data.json())
    .then(data => dispatch(loaded(tag, data)))
    .catch(err => dispatch(error(tag, err)))
}
export const random = () => dispatch => {
  const { options } = store.getState().search
  const qs = querystring.stringify({ limit: options.perPage })
  const tag = 'query'
  dispatch(loading(tag))
  fetch(url.random() + '?' + qs, {
    method: 'GET',
    mode: 'cors',
  })
    .then(data => data.json())
    .then(data => {
      dispatch(loaded(tag, data))
      history.push(publicUrl.searchByVerifiedFrame(data.query.verified, data.query.hash, data.query.frame))
      // window.history.pushState(null, 'VSearch: Results', publicUrl.searchByVerifiedFrame(data.query.verified, data.query.hash, data.query.frame))
    })
    .catch(err => dispatch(error(tag, err)))
}
