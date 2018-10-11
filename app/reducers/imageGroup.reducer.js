import * as types from '../actions/types'

const imageGroupInitialState = {
  loading: false,
  error: null,
  page: {},
  group: null,
  index: 0,
}

const imageGroupReducer = (state = imageGroupInitialState, action) => {
  let results;

  switch(action.type) {
    case types.IMAGE_GROUP.LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case types.IMAGE_GROUP.DID_LOAD:
      return {
        ...state,
        loading: false,
        error: null,
      }

    case types.IMAGE_GROUP.LOAD_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      }
    
    case types.IMAGE_GROUP.LOAD_PAGE:
      return {
        ...state,
        page: action.data,
      }

    case types.IMAGE_GROUP.REFRESH_ITEM:
      if (! state.page.results) {
        return { ...state }
      }
      results = state.page.results.map(result => {
        if (result.id === action.data.id) {
          return Object.assign(result, action.data)
        }
        return result
      })
      return {
        ...state,
        page: {
          ...state.page,
          results,
        }
      }

    case types.IMAGE_GROUP.FORGET_ITEM:
      if (! state.page.results) {
        return { ...state }
      }
      results = state.page.results.filter(result => {
        return result.id !== action.id
      })
      return {
        ...state,
        page: {
          ...state.page,
          results,
        }
      }


    default:
      return state
  }
}

export default imageGroupReducer
