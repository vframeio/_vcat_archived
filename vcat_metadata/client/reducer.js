import * as types from './types'

const initialState = {
}

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_HASH:
      state = {
        ...state,
        hash: action.hash,
      }
      return state

    case types.LOADING:
      // if (action.hash !== state.hash) return state
      return {
        ...state,
        [action.tag]: 'loading',
      }

    case types.LOADED:
      // if (action.hash !== state.hash) return state
      return {
        ...state,
        [action.tag]: action.data,
      }

    case types.LOADED_MANY:
      // if (action.hash !== state.hash) return state
      return action.data.reduce((a, b) => {
        a[b.name] = b.data || 'error'
        return a
      }, {
        ...state,
        [action.tag]: 'loaded'
      })

    case types.ERROR:
      return {
        ...state,
        [action.tag]: action.err,
      }

    default:
      return state
  }
}
