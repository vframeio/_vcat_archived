// import fetchJsonp from 'fetch-jsonp'
import * as types from '../types'
// import { hashPath } from '../util'

const url = {
  upload: () => '/search/api/upload',
  search: uri => '/search/api/fetch/?url=' + encodeURIComponent(uri),
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
  const tag = 'query'
  const fd = new FormData()
  fd.append('query_img', file)
  dispatch(loading(tag))
  post(url.upload(), fd)
    .then(data => dispatch(loaded(tag, data)))
    .catch(err => dispatch(error(tag, err)))
}
export const search = uri => dispatch => {
  const tag = 'query'
  dispatch(loading(tag))
  fetch(url.search(uri), {
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
  const tag = 'query'
  dispatch(loading(tag))
  fetch(url.random(), {
    method: 'GET',
    mode: 'cors',
  })
    .then(data => data.json())
    .then(data => dispatch(loaded(tag, data)))
    .catch(err => dispatch(error(tag, err)))
}
