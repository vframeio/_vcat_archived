import * as types from '../types'

const initialState = {
}

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case types.search.set_hash:
      state = {
        ...state,
        hash: action.hash,
      }
      return state

    case types.search.loading:
      // if (action.hash !== state.hash) return state
      return {
        ...state,
        [action.tag]: 'loading',
      }

    case types.search.loaded:
      // if (action.hash !== state.hash) return state
      return {
        ...state,
        [action.tag]: action.data,
      }

    case types.search.error:
      return {
        ...state,
        [action.tag]: action.err,
      }

    default:
      return state
  }
}
