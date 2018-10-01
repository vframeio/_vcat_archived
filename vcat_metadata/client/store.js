import { applyMiddleware, compose, combineReducers, createStore } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory, createHashHistory } from 'history'
import thunk from 'redux-thunk'
import appReducer from './reducer'

const rootReducer = combineReducers({
  app: appReducer,
})

function configureStore(initialState = {}, history) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(
    connectRouter(history)(rootReducer), // new root reducer with router state
    initialState,
    composeEnhancers(
      applyMiddleware(
        thunk,
        routerMiddleware(history)
      ),
    ),
  )

  return store
}

const history = createBrowserHistory()
const store = configureStore({}, history)

export { store, history }
