import { compose, createStore, applyMiddleware } from 'redux';
// import { createLogger } from 'redux-logger';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage'
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory';

import appReducer from '../reducers';

export const history = createHistory();

const config = {
  key: 'root',
  storage,
}

const reducer = persistCombineReducers(config, appReducer)

export const store = createStore(
  reducer,
  compose(
    applyMiddleware(
      // createLogger(),
      thunk,
      routerMiddleware(history),
    )
  )
);

export const persistor = persistStore(store);
