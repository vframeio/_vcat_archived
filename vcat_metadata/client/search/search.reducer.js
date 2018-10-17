import * as types from '../types'
import session from '../session'

const initialState = {
  query: { reset: true },
  browse: { reset: true },
  options: {
    thumbnailSize: session('thumbnailSize') || 'th',
    perPage: parseInt(session('perPage'), 10) || 50,
  }
}
const loadingState = {
  query: {
    query: { loading: true },
    results: []
  },
  loading: {
    loading: true
  }
}

export default function searchReducer(state = initialState, action) {
  console.log(action.type, action)
  switch (action.type) {
    case types.search.loading:
      return {
        ...state,
        [action.tag]: loadingState[action.tag] || loadingState.loading,
      }

    case types.search.loaded:
      return {
        ...state,
        [action.tag]: action.data,
      }

    case types.search.error:
      return {
        ...state,
        [action.tag]: { error: action.err },
      }

    case types.search.panic:
      window.history.pushState(null, 'VSearch', '/search/')
      return {
        ...initialState,
      }

    case types.search.update_options:
      session.setAll(action.opt)
      return {
        ...state,
        options: {
          ...action.opt,
        }
      }

    default:
      return state
  }
}
