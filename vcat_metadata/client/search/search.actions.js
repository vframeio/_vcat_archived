// import fetchJsonp from 'fetch-jsonp'
import * as types from '../types'
// import { hashPath } from '../util'

const url = {
  upload: () => '/search/api/upload',
  search: uri => '/search/api/fetch/?url=' + encodeURIComponent(uri),
  browse: hash => '/search/api/list/' + hash,
  random: () => '/search/api/random/',
  check: () => '/api/images/import/search/',
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

export const panic = () => dispatch => {
  dispatch({ type: types.search.panic })
}
export const upload = file => dispatch => {
  const tag = 'query'
  const fd = new FormData()
  fd.append('query_img', file)
  document.body.className = 'loading'
  dispatch(loading(tag))
  fetch(url.upload(), {
    method: 'POST',
    mode: 'cors',
    data: fd,
  })
    .then(data => data.json())
    .then(data => dispatch(loaded(tag, data)))
    .catch(err => dispatch(error(tag, err)))
}
export const search = url => dispatch => {
  const tag = 'query'
  document.body.className = 'loading'
  dispatch(loading(tag))
  fetch(url.search(url), {
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

// export const fetch = hash => dispatch => dispatchFetch('mediaRecord', hash)(dispatch)
