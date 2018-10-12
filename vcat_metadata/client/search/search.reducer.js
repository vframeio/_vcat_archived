import * as types from '../types'

const initialState = {
}

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case types.search.loading:
      return {
        ...state,
        [action.tag]: 'loading',
      }

    case types.search.loaded:
      return {
        ...state,
        [action.tag]: action.data,
      }

    case types.search.error:
      return {
        ...state,
        [action.tag]: action.err,
      }

    case types.search.panic:
      return {
        ...initialState,
      }

    default:
      return state
  }
}
