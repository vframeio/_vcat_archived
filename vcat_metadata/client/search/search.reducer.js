import * as types from '../types'

const initialState = {
  query: {},
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
      if (action.data.query.url) {
        window.history.pushState(null, 'VSearch: Results', '/search/?url=' + action.data.query.url)
      }
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
      return {
        ...initialState,
      }

    default:
      return state
  }
}
