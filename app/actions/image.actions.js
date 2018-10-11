import apiClient from '../util/apiClient'
import uploadClient from '../util/uploadClient'
import * as api from '../util/api'
import * as types from './types'

export function loading(){
  return { type: types.IMAGE.LOADING }
}
export function didLoad(){
  return { type: types.IMAGE.DID_LOAD }
}
export function clearCachedImage(){
  return { type: types.IMAGE.CLEAR_CACHED_IMAGE }
}
export function loadPage(data){
  return { type: types.IMAGE.LOAD_PAGE, data }
}
export function loadIndex(data){
  return { type: types.IMAGE.LOAD_INDEX, data }
}
export function loadItem(data){
  return { type: types.IMAGE.LOAD_ITEM, data }
}
export function loadError() {
  return { type: types.IMAGE.LOAD_ERROR }
}
export function loadAnnotated(data){
  return { type: types.IMAGE.LOAD_ANNOTATED, data }
}
export function loadStats(data){
  return { type: types.IMAGE.LOAD_STATS, data }
}
export function loadNonannotated(data){
  return { type: types.IMAGE.LOAD_NONANNOTATED, data }
}
export function loadImageRegion(uuid, data){
  return { type: types.IMAGE.LOAD_IMAGE_REGION, uuid, data }
}
export function forgetImageRegion(id){
  return { type: types.IMAGE.FORGET_IMAGE_REGION, id }
}
export function updateItem(data){
  return { type: types.IMAGE.UPDATE_ITEM, data }
}
export function browseTo(id){
  return { type: types.IMAGE.BROWSE_TO, id }
}
export function updateImageSize(image, dims){
  const new_image = Object.assign({}, image, dims)
  if ((!image.width || !image.height) && dims.width && dims.height) {
    update(image.id, new_image)
  }
  return { type: types.IMAGE.LOAD_ITEM, data: new_image }
}

export function resetLoading(){
  return (dispatch) => {
    dispatch(didLoad())
  }
}

export function index(tag, qs) {
  tag = tag || ""
  qs = qs || ""
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .get(api.images + tag + qs)
    .then(function (response) {
      dispatch(loadPage(response.data));
      dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}

export function stats(qs) {
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .get(api.images + 'stats/')
    .then(function (response) {
      dispatch(loadStats(response.data));
      dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}

export function annotated(qs) {
  qs = qs || ""
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .get(api.images + 'user/annotated/' + qs)
    .then(function (response) {
      dispatch(loadAnnotated(response.data));
      dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}

export function nonannotated(qs) {
  qs = qs || ""
  return (dispatch) => {
    dispatch(loading());
    apiClient()
    .get(api.images + 'user/nonannotated/' + qs)
    .then(function (response) {
      dispatch(loadNonannotated(response.data));
      dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}

export function upload(data, files, cb) {
  return (dispatch) => {
    let fd = new FormData()
    // console.log(data)
    Object.keys(data).forEach(key => fd.append(key, data[key]))
    files.forEach(f => fd.append('file', f))
    dispatch(loading());
    uploadClient()
    .post(api.images + 'new/', fd)
    .then(function (response) {
      console.log(response.data)
      dispatch(didLoad());
      dispatch(loadItem(response.data));
      if (cb) {
        cb(response.data)
      } else {
        window.location.href = "/images/"
      }
    })
    .catch(function (error) {
      dispatch(didLoad());
      console.error(error)
      // throw error;
    });
  }
}

export function search(file, cb) {
  var fd = new FormData()
  fd.append('file', file)
  return (dispatch) => {
    // dispatch(loading());
    uploadClient()
    .put(api.images + 'search/', fd)
    .then(function (response) {
      // console.log(response.data)
      // dispatch(didLoad());
      // dispatch(loadItem(response.data));
      if (cb) {
        cb(response.data)
      }
    })
    .catch(function (error) {
      dispatch(didLoad());
      console.error(error)
      // throw error;
    });
  }
}

export function show(id) {
  return (dispatch) => {
    if (!id) return
    // dispatch(loading());
    dispatch(clearCachedImage())
    apiClient()
    .get(api.images + "show/" + id)
    .then(function (response) {
      let item = response.data
      if (! item.width || !item.height) {
        loadImage(item)(dispatch)
      } else {
        dispatch(loadItem(item));
      }
      // dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}

export function loadImage(item){
  return (dispatch) => {
    const img = document.createElement("img")
    let loaded = false
    img.onload = () => {
      if (loaded) return
      loaded = true
      item.width = img.naturalWidth
      item.height = img.naturalHeight
      dispatch(loadItem(item));
    }
    img.onerror = () => {
      if (loaded) return
      dispatch(loadError())
    }
    img.src = api.image_url(item, "images", "lg")
    if (img.complete) img.onload()
  }
}

export function update(id, data, fn) {
  return (dispatch) => {
    dispatch(updateItem(data));
    dispatch(loading());
    apiClient()
    .put(api.images + "edit/" + id, data)
    .then(function (response) {
      console.log(response.data)
      dispatch(didLoad());
      dispatch(updateItem(response.data));
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
    .delete(api.images + "show/" + id)
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

export function createRegion(data) {
  return (dispatch) => {
    // dispatch(loading());
    apiClient()
    .post(api.imageRegion, data)
    .then(function (response) {
      dispatch(didLoad());
      dispatch(loadImageRegion(data.uuid, response.data));
    })
    .catch(function (error) {
      throw error;
    });
  };
}

let updateTimeouts = {};
export function updateRegion(id, data) {
  return (dispatch) => {
    // dispatch(loading());
    dispatch(loadImageRegion(data.uuid, data));
    clearTimeout(updateTimeouts[id])
    updateTimeouts[id] = setTimeout(() => {
      apiClient()
      .put(api.imageRegion + id, data)
      .then(function (response) {
        delete updateTimeouts[id]
        let new_data = {
          ...response.data,
          area: data.area, uuid: data.uuid,
        }
        dispatch(didLoad());
        dispatch(loadImageRegion(data.uuid, new_data));
      })
      .catch(function (error) {
        delete updateTimeouts[id]
        throw error;
      });
    }, 2000)
  };
}

export function destroyRegion(id) {
  return (dispatch) => {
    delete updateTimeouts[id]
    // dispatch(loading());
    dispatch(forgetImageRegion(id));
    apiClient()
    .delete(api.imageRegion + id)
    .then(function (response) {
      dispatch(didLoad());
    })
    .catch(function (error) {
      throw error;
    });
  };
}
