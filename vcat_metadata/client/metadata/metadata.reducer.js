import * as types from '../types'

const initialState = {
}

export default function metadataReducer(state = initialState, action) {
  switch (action.type) {
    case types.metadata.set_hash:
      state = {
        ...state,
        hash: action.hash,
      }
      return state

    case types.metadata.loading:
      // if (action.hash !== state.hash) return state
      return {
        ...state,
        [action.tag]: 'loading',
      }

    case types.metadata.loaded:
      // if (action.hash !== state.hash) return state
      return {
        ...state,
        [action.tag]: action.data,
      }

    case types.metadata.loaded_many:
      // if (action.hash !== state.hash) return state
      return action.data.reduce((a, b) => {
        a[b.name] = b.data || 'error'
        return a
      }, {
        ...state,
        [action.tag]: 'loaded'
      })

    case types.metadata.error:
      return {
        ...state,
        [action.tag]: action.err,
      }

    default:
      return state
  }
}
