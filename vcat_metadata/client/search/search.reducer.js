import * as types from '../types'

const initialState = {
  query: {},
  options: {
    thumbnailSize: 'th',
    perPage: 50,
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
