// import fetchJsonp from 'fetch-jsonp'
import * as types from '../types'
// import { hashPath } from '../util'
import { store } from '../store'
import { pad } from '../util'
import querystring from 'query-string'

const url = {
  upload: () => '/search/api/upload',
  search: () => '/search/api/fetch',
  searchByFrame: (hash, frame) => '/search/api/fetch/' + hash + '/' + pad(frame, 6),
  browse: hash => '/search/api/list/' + hash,
  random: () => '/search/api/random',
  check: () => '/api/images/import/search',
}

const loading = (tag) => ({
  type: types.search.loading,
  tag
})
const loaded = (tag, data) => ({
  type: types.search.loaded,
  tag,
  data
})
const error = (tag, err) => ({
  type: types.search.error,
  tag,
  err
})

export const post = (uri, data) => {
  let headers
  if (data instanceof FormData) {
    headers = {
      Accept: 'application/json, application/xml, text/play, text/html, *.*',
      // Authorization: 'Token ' + token,
    }
  } else {
    headers = {
      Accept: 'application/json, application/xml, text/play, text/html, *.*',
      'Content-Type': 'application/json; charset=utf-8',
      // Authorization: 'Token ' + token,
    }
    data = JSON.stringify(data)
  }

  // headers['X-CSRFToken'] = csrftoken
  return fetch(uri, {
    method: 'POST',
    body: data,
    credentials: 'include',
    headers,
  }).then(res => res.json())
}
export const panic = () => dispatch => {
  dispatch({ type: types.search.panic })
}
export const updateOptions = opt => dispatch => {
  dispatch({ type: types.search.update_options, opt })
}
export const upload = file => dispatch => {
  const { options } = store.getState().search
  const tag = 'query'
  const fd = new FormData()
  fd.append('query_img', file)
  fd.append('limit', options.perPage)
  dispatch(loading(tag))
  post(url.upload(), fd)
    .then(data => {
      dispatch(loaded(tag, data))
      if (data.query.url && !window.location.search.match(data.query.url)) {
        window.history.pushState(null, 'VSearch: Results', '/search/?url=' + data.query.url)
      }
    })
    .catch(err => dispatch(error(tag, err)))
}
export const searchByFrame = (hash, frame) => dispatch => {
  const { options } = store.getState().search
  const tag = 'query'
  dispatch(loading(tag))
  const qs = querystring.stringify({ limit: options.perPage })
  fetch(url.searchByFrame(hash, frame) + '?' + qs, {
    method: 'GET',
    mode: 'cors',
  })
    .then(data => data.json())
    .then(data => dispatch(loaded(tag, data)))
    .catch(err => dispatch(error(tag, err)))
}
export const search = uri => dispatch => {
  const { options } = store.getState().search
  const tag = 'query'
  dispatch(loading(tag))
  const qs = querystring.stringify({ url: uri, limit: options.perPage })
  fetch(url.search(uri) + '?' + qs, {
    method: 'GET',
    mode: 'cors',
  })
    .then(data => data.json())
    .then(data => dispatch(loaded(tag, data)))
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
      window.history.pushState(null, 'VSearch: Results', '/search/keyframe/' + data.query.hash + '/' + data.query.frame + '/')
    })
    .catch(err => dispatch(error(tag, err)))
}
