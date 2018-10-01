import { routerReducer } from 'react-router-redux'

import authReducer from './auth.reducer'
import navReducer from './nav.reducer'
import editorReducer from './editor.reducer'
import imageReducer from './image.reducer'
import imageGroupReducer from './imageGroup.reducer'
import userReducer from './user.reducer'
import hierarchyReducer from './hierarchy.reducer'

const appReducers = {
  auth: authReducer,
  nav: navReducer,
  hierarchy: hierarchyReducer,
  image: imageReducer,
  imageGroup: imageGroupReducer,
  editor: editorReducer,
  user: userReducer,
  router: routerReducer,
}

export default appReducers
