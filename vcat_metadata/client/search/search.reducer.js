import * as types from '../types'
import session from '../session'

console.log(session)

const initialState = {
  query: { reset: true },
  options: {
    thumbnailSize: session('thumbnailSize') || 'th',
    perPage: parseInt(session('perPage'), 10) || 50,
  }
}

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case types.search.loading:
      return {
        ...state,
        [action.tag]: {
          query: { loading: true },
          results: []
        },
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
