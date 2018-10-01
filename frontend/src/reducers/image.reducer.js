import uuid from 'uuid/v4'
import * as types from '../actions/types'

const imageInitialState = {
  loading: false,
  loaded: false,
  currentId: 0,
  image: null,
  error: null,
  page: [],
  annotated: [],
  nonannotated: [],
  stats: null,
  group: null,
  index: 0,
}

const imageReducer = (state = imageInitialState, action) => {
  let image, images, group, state_image;
  switch(action.type) {
    case types.IMAGE.LOADING:
      return {
        ...state,
        loading: true,
      }

    case types.IMAGE.DID_LOAD:
      return {
        ...state,
        loading: false,
      }

    case types.IMAGE.CLEAR_CACHED_IMAGE:
      return {
        ...state,
        image: null,
        loading: false,
        error: null,
      }

    case types.IMAGE.LOAD_ANNOTATED:
      return {
        ...state,
        annotated: action.data,
      }

    case types.IMAGE.LOAD_NONANNOTATED:
      return {
        ...state,
        nonannotated: action.data,
      }
    
    case types.IMAGE.LOAD_STATS:
      return {
        ...state,
        stats: action.data,
      }

    case types.IMAGE.LOAD_PAGE:
      return {
        ...state,
        page: action.data,
      }

    case types.IMAGE_GROUP.LOAD_GROUP:
      return {
        ...state,
        group: action.data,
      }

    case types.IMAGE_GROUP.SET_INDEX:
    case types.IMAGE.LOAD_ITEM:
      action.data.regions && action.data.regions.forEach(region => {
        region.uuid = region.uuid || region.id
        region.area = region.width * region.height
        if (region.x > 1) region.x %= 1
        if (region.y > 1) region.y %= 1
        if (region.width > 1) region.width %= 1
        if (region.height > 1) region.height %= 1
      })
      return {
        ...state,
        image: action.data,
        loading: false,
        error: null,
        index: ('index' in action) ? action.index : state.index,
      }

    case types.IMAGE.UPDATE_ITEM:
      images = state.group.images.map(el => {
        if (el.id === action.data.id) {
          image = {
            ...el,
            ...action.data,
          }
          return image
        }
        return el
      })
      if (image && state.image.id === image.id) {
        state_image = image
      }
      else {
        state_image = state.image
      }
      return {
        ...state,
        group: {
          ...state.group,
          images,
        },
        image: state_image,
      }

    case types.IMAGE.LOAD_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      }

    case types.IMAGE.LOAD_IMAGE_REGION:
      let region_was_found = false
      let _uuid = action.uuid
      let data = action.data
      let new_regions = state.image.regions.map(region => {
        if (region.uuid === _uuid) {
          region_was_found = true
          data.uuid = _uuid
          return data
        }
        return region
      })
      if (!region_was_found) {
        data.uuid = _uuid
        new_regions.push(data)
      }
      image = {
        ...state.image,
        regions: new_regions,
      }

      return {
        ...state,
        group: update_group(state.group, image),
        image,
      }

    case types.IMAGE.FORGET_IMAGE_REGION:
      image = {
        ...state.image,
        regions: state.image.regions.filter(region => region.id !== action.id),
      }

      return {
        ...state,
        group: update_group(state.group, image),
        image,
      }

    case types.AUTH.LOGOUT_USER:
      return {
        ...imageInitialState
      }

    default:
      return state
  }
}

function update_group(group, image){
  if (!group) return null
  const images = (group.images || []).map(el => {
    if (el.id === image.id) {
      return image
    }
    return el
  })
  return {
    ...group,
    images,
  }
}

export default imageReducer
