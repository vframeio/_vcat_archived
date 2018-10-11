import * as types from '../actions/types'

const hierarchyInitialState = {
  loading: false,
  loaded: false,
  currentId: 0,
  nodes: {},
  children: {},
  images: {},
  galleryMode: 'images',
}

const auth = (state = hierarchyInitialState, action) => {
  let images, old_el
  switch(action.type) {
    case types.HIERARCHY.LOADING:
      return {
        ...state,
        loading: true,
        loaded: false,
      }

    case types.HIERARCHY.DID_LOAD:
      return {
        ...state,
        loading: false,
        loaded: true,
      }

    case types.HIERARCHY.BROWSE_TO:
      return {
        ...state,
        currentId: action.id,
      }

    case types.HIERARCHY.SET_GALLERY_MODE:
      return {
        ...state,
        galleryMode: action.mode,
      }

    case types.HIERARCHY.LOAD_INDEX:
      const nodes = {}, children = {}
      action.data.forEach(el => {
        const id = el.id || 0
        const parent = el.parent || 0
        nodes[id] = el
        children[id] = children[id] || []
        children[parent] = children[parent] || []
        children[parent].push(id)
      })
      return {
        ...state,
        nodes,
        children,
      }

    case types.HIERARCHY.LOAD_ITEM:
      let el = action.data
      old_el = state.nodes[el.id]
      let parent_id = el.parent || 0
      let child = state.children[el.id] || []
      let parent = state.children[parent_id] || []
      if (parent.indexOf(el.id) === -1) {
        parent.push(el.id)
      }
      if (old_el) {
        el.images = el.images || old_el.images
      }
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [el.id]: el,
        },
        children: {
          ...state.children,
          [el.id]: child,
          [parent_id]: parent,
        }
      }

    case types.HIERARCHY.FORGET_ITEM:
      let id = action.id
      let { ...new_nodes } = state.nodes
      old_el = new_nodes[id]
      delete new_nodes[id]
      let new_children = {}
      Object
        .keys(state.children)
        .filter(child_id => child_id !== id)
        .forEach(id => new_children[id] = state.children[id])
      if (new_children[old_el.parent]) {
        new_children[old_el.parent] = new_children[old_el.parent].filter(child_id => child_id !== id)
      }

      return {
        ...state,
        currentId: old_el.parent,
        nodes: new_nodes,
        children: new_children,
      }

    case types.HIERARCHY.SET_NODE:
      id = action.data.id
      return {
        ...state,
        nodes: {
          ...state.hierarchy,
          [id]: action.data,
        }
      }

    case types.HIERARCHY.LOAD_IMAGES_FOR_ID:
      id = action.id
      images = action.images
      return {
        ...state,
        images: {
          ...state.images,
          [id]: images,
        }
      }

    case types.AUTH.LOGOUT_USER:
      return {
        ...hierarchyInitialState
      }
    
    default:
      return state
  }
}

export default auth
