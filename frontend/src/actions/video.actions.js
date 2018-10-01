import apiClient from '../util/apiClient';
import * as api from '../util/api';
import * as types from './types';

export function loading(){
  return { type: types.VIDEO.LOADING }
}
export function didLoad(){
  return { type: types.VIDEO.DID_LOAD }
}
export function loadIndex(data){
  return { type: types.VIDEO.LOAD_INDEX, data }
}
export function browseTo(id){
  return { type: types.VIDEO.BROWSE_TO, id }
}

export function index() {
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .get(api.video.index)
    .then(function (response) {
      dispatch(loadIndex(response.data));
      dispatch(didLoad());
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
    .post(api.video.create, data)
    .then(function (response) {
      // dispatch(didLoad(response.data));
      dispatch(didLoad());
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
    .post(api.video.update + id, data)
    .then(function (response) {
      // dispatch(didLoad(response.data));
      dispatch(didLoad());
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
    .post(api.video.destroy + id)
    .then(function (response) {
      // dispatch(didLoad(response.data));
      dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}
