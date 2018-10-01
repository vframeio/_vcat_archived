import fetchJsonp from 'fetch-jsonp'
import * as types from './types'
import { hashPath } from './util'

const url = {
  mediaRecord: hash => '/search/api/mediarecord/' + hash,
  // mediaInfo: hash => 'https://sa-vframe.ams3.digitaloceanspaces.com/v1/metadata/mediainfo/' + hashPath(hash) + '/index.json',
}

const loading = (tag, hash) => ({
  type: types.LOADING,
  tag,
  hash
})
const loaded = (tag, hash, data) => ({
  type: types.LOADED,
  tag,
  hash,
  data
})
const loadedMany = (tag, hash, data) => ({
  type: types.LOADED_MANY,
  tag,
  hash,
  data
})
const error = (tag, hash, err) => ({
  type: types.ERROR,
  tag,
  hash,
  err
})

const get = uri => fetch(uri, {}).then(data => data.json())

export const setHash = (hash) => (dispatch) => {
  dispatch({
    type: types.SET_HASH,
    hash,
  })
}

export const dispatchFetch = (tag, hash) => dispatch => {
  dispatch(loading(tag, hash))
  get(url[tag](hash), {
    method: 'GET',
    mode: 'cors',
  })
    .then(data => dispatch(loaded(tag, hash, data)))
    .catch(err => dispatch(error(tag, hash, err)))
}

export const fetchMediaRecord = hash => dispatch => dispatchFetch('mediaRecord', hash)(dispatch)
export const fetchMediaInfo = hash => dispatch => dispatchFetch('mediaInfo', hash)(dispatch)
export const fetchMetadata = hash => dispatch => {
  dispatch(loading('metadata', hash))
  fetchJsonp(process.env.API_HOST + '/api/metadata/' + hash + '/')
    .then(res => res.json())
    .then(data => dispatch(loadedMany('metadata', hash, data)))
    .catch(err => dispatch(error('metadata', hash, err)))
}
