import apiClient from '../util/apiClient'
import * as api from '../util/api'
import * as types from './types'
import queryString from 'query-string'

import { store } from '../util/store'

import { loadItem as loadImageItem } from './image.actions'
 
export function loading(){
  return { type: types.IMAGE_GROUP.LOADING }
}
export function didLoad(){
  return { type: types.IMAGE_GROUP.DID_LOAD }
}
export function loadError() {
  return { type: types.IMAGE_GROUP.LOAD_ERROR }
}
export function loadPage(data) {
  return { type: types.IMAGE_GROUP.LOAD_PAGE, data }
}
export function loadGroup(data) {
  return { type: types.IMAGE_GROUP.LOAD_GROUP, data }
}
export function refreshItem(data) {
  return { type: types.IMAGE_GROUP.REFRESH_ITEM, data }
}
export function forgetItem(id) {
  return { type: types.IMAGE_GROUP.FORGET_ITEM, id }
}
export function setIndex(index) {
  const state = store.getState()
  if (! state.image.group.images) return
  const images = state.image.group.images
  index = (index + images.length) % images.length
  const data = images[index]
  return { type: types.IMAGE_GROUP.SET_INDEX, index, data }
}
export function nextIndex() {
  const state = store.getState()
  const index = state.image.index + 1
  return setIndex(index)
}
export function prevIndex() {
  const state = store.getState()
  const index = state.image.index - 1
  return setIndex(index)
}

export function index(qs) {
  if (!qs) {
    qs = ""
  }
  else if (typeof qs === "object") {
    qs = "?" + queryString.stringify(qs)
  }
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .get(api.imageGroup + qs)
    .then(function (response) {
      dispatch(loadPage(response.data));
      dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}

export function show(id, image_id) {
  return (dispatch) => {
    image_id = parseInt(image_id, 10)
    // dispatch(loading());
    apiClient()
    .get(api.imageGroup + "show/" + id)
    .then(function (response) {
      dispatch(loadGroup(response.data))
      if (image_id && response.data.images) {
        response.data.images.some((el,i) => {
          if (image_id === el.id) {
            dispatch(setIndex(i))
            return true
          }
          return false
        })
      }
      dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}

export function update(id, data, fn) {
  return (dispatch) => {
    // dispatch(loading());
    apiClient()
    .put(api.imageGroup + "edit/" + id, data)
    .then(function (response) {
      // dispatch(didLoad());
      dispatch(refreshItem(response.data));
      fn && fn()
    })
    .catch(function (error) {
      throw error;
    });
  };
}

export function destroy(id) {
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .delete(api.imageGroup + "show/" + id)
    .then(function (response) {
      // dispatch(didLoad(response.data));
      dispatch(forgetItem(id))
      dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}
