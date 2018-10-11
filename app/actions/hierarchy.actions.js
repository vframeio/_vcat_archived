import apiClient from '../util/apiClient'
import * as api from '../util/api'
import * as types from './types'

export function loading(){
  return { type: types.HIERARCHY.LOADING }
}
export function didLoad(){
  return { type: types.HIERARCHY.DID_LOAD }
}
export function loadIndex(data){
  return { type: types.HIERARCHY.LOAD_INDEX, data }
}
export function loadItem(data){
  return { type: types.HIERARCHY.LOAD_ITEM, data }
}
export function forgetItem(id){
  return { type: types.HIERARCHY.FORGET_ITEM, id }
}
export function browseTo(id){
  return { type: types.HIERARCHY.BROWSE_TO, id }
}
export function setGalleryMode(mode){
  return { type: types.HIERARCHY.SET_GALLERY_MODE, mode }
}
export function loadImagesForId(id, images){
  return { type: types.HIERARCHY.LOAD_IMAGES_FOR_ID, id, images }
}

export function index() {
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .get(api.hierarchy)
    .then(function (response) {
      dispatch(loadIndex(response.data));
      dispatch(didLoad());
    })
    .catch(function (error) {
      dispatch(didLoad());
      console.error(error)
      // throw error;
    });
  };
}

export function show(id) {
  return (dispatch) => {
    // dispatch(loading());
    apiClient()
    .get(api.hierarchy + id)
    .then(function (response) {
      // console.log(response.data)
      dispatch(loadItem(response.data));
      // dispatch(didLoad());
    })
    .catch(function (error) {
      dispatch(didLoad());
      console.error(error)
      // throw error;
    });
  };
}

export function show_full(id) {
  return (dispatch) => {
    // dispatch(loading());
    apiClient()
    .get(api.hierarchy + id + '/full')
    .then(function (response) {
      // console.log(response.data)
      dispatch(loadItem(response.data));
      // dispatch(didLoad());
    })
    .catch(function (error) {
      dispatch(didLoad());
      console.error(error)
      // throw error;
    });
  };
}

export function show_regions(id) {
  return (dispatch) => {
    // dispatch(loading());
    apiClient()
    .get(api.hierarchy + id + '/regions')
    .then(function (response) {
      // console.log(response.data)
      let data = response.data
      const imageLookup = data.imageLookup = {}
      data.images.forEach(img => imageLookup[img.id] = img)
      data.regions = data.regions.map(r => [r.image, r])
      .sort((a,b) => a[0] - b[0])
      .map(pair => {
        const region = pair[1]
        const image = imageLookup[region.image]
        if (image) {
          image.regions = image.regions || []
          image.regions.push(region)
        }
        return region
      })
      dispatch(loadItem(data));
      // dispatch(didLoad());
    })
    .catch(function (error) {
      dispatch(didLoad());
      console.error(error)
      // throw error;
    });
  };
}

export function create(data) {
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .post(api.hierarchy + "new", data)
    .then(function (response) {
      // dispatch(didLoad(response.data));
      dispatch(didLoad());
      dispatch(loadItem(response.data));
      window.location.href = "/hierarchy/" + response.data.id
    })
    .catch(function (error) {
      dispatch(didLoad());
      console.error(error)
      // throw error;
    });
  };
}

export function update(id, data) {
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .put(api.hierarchy + id + "/update/", data)
    .then(function (response) {
      dispatch(didLoad());
      dispatch(loadItem(data));
      window.location.href = "/hierarchy/" + id
    })
    .catch(function (error) {
      dispatch(didLoad());
      console.error(error)
      // throw error;
    });
  };
}

export function destroy(id) {
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .delete(api.hierarchy + id + "/destroy/")
    .then(function (response) {
      // dispatch(didLoad(response.data));
      dispatch(forgetItem(id))
      index()(dispatch)
      setTimeout(() => {
        window.location.href = "/categories/"
      }, 250)
    })
    .catch(function (error) {
      dispatch(didLoad());
      console.error(error)
      // throw error;
    });
  };
}
