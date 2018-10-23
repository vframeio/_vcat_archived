import * as types from '../types'
import session from '../session'

const initialState = () => ({
  query: { reset: true },
  browse: { reset: true },
  options: {
    thumbnailSize: session('thumbnailSize') || 'th',
    perPage: parseInt(session('perPage'), 10) || 50,
    groupByHash: session('groupByHash'),
  }
})

const loadingState = {
  query: {
    query: { loading: true },
    results: []
  },
  loading: {
    loading: true
  }
}

export default function searchReducer(state = initialState(), action) {
  console.log(action.type, action)
  switch (action.type) {
    case types.search.loading:
      if (action.tag === 'query' && action.offset) {
        return {
          ...state,
          query: {
            ...state.query,
            loadingMore: true,
          }
        }
      }
      return {
        ...state,
        [action.tag]: loadingState[action.tag] || loadingState.loading,
      }

    case types.search.loaded:
      if (action.tag === 'query' && action.offset) {
        return {
          ...state,
          query: {
            query: action.data.query,
            results: [
              ...state.query.results,
              ...action.data.results,
            ],
            loadingMore: false,
          }
        }
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
        ...initialState(),
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
