import apiClient from '../util/apiClient'
import * as api from '../util/api'
import * as types from './types'

export function loading(){
  return { type: types.EDITOR.LOADING }
}
export function didLoad(){
  return { type: types.EDITOR.DID_LOAD }
}
export function loadIndex(data){
  return { type: types.EDITOR.LOAD_INDEX, data }
}
export function loadItem(data){
  return { type: types.EDITOR.LOAD_ITEM, data }
}
export function setSelectedId(id){
  return { type: types.EDITOR.SET_SELECTED_ID, id }
}
export function clearSelectedId(){
  return { type: types.EDITOR.CLEAR_SELECTED_ID }
}

export function index() {
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .get(api.editor)
    .then(function (response) {
      dispatch(loadIndex(response.data));
      dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}

export function show(id) {
  return (dispatch) => {
    // dispatch(loading());
    apiClient()
    .get(api.editor + id)
    .then(function (response) {
      // console.log(response.data)
      dispatch(loadItem(response.data));
      // dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}

export function create(data) {
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .post(api.editor, data)
    .then(function (response) {
      // dispatch(didLoad(response.data));
      dispatch(didLoad());
      dispatch(loadItem(response.data));
      window.location.href = "/editor/" + response.data.id
    })
    .catch(function (error) {
      throw error;
    });
  };
}

export function update(id, data) {
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .put(api.editor.update + id, data)
    .then(function (response) {
      dispatch(didLoad());
      dispatch(loadItem(response.data));
      window.location.href = "/editor/" + id
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
    .delete(api.editor + id)
    .then(function (response) {
      // dispatch(didLoad(response.data));
      // dispatch(forgetItem(id))
      dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}
