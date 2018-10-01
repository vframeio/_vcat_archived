import * as types from '../actions/types'

const videoInitialState = {
  loading: false,
  loaded: false,
  currentId: 0,
  list: [],
}

const auth = (state = videoInitialState, action) => {
  let id
  switch(action.type) {
    case types.VIDEO.LOADING:
      return {
        ...state,
        loading: true,
        loaded: false,
      }

    case types.VIDEO.DID_LOAD:
      return {
        ...state,
        loading: false,
        loaded: true,
      }

    case types.VIDEO.BROWSE_TO:
      return {
        ...state,
        currentId: action.id,
      }

    case types.VIDEO.LOAD_INDEX:
      const nodes = {}, children = {}
      action.data.forEach(el => {
        nodes[el.id] = el
        children[el.id] = children[el.id] || []
        children[el.parent] = children[el.parent] || []
        children[el.parent].push(el.id)
      })
      return {
        ...state,
        nodes,
        children,
      }

    case types.VIDEO.SET_NODE:
      id = action.data.id
      return {
        ...state,
        nodes: {
          ...state.video,
          [id]: action.data,
        }
      }

    case types.AUTH.LOGOUT_USER:
      return {
        ...videoInitialState
      }

    default:
      return state
  }
}

export default auth
