import * as types from '../actions/types';

const userInitialState = {
  list: [],
  loading: false,
};
const user = (state = userInitialState, action) => {
  switch(action.type) {
    case types.USER.SET_USERS:
      return {
        ...state,
        list: action.data,
      }
    default:
      return state;
  }
}

export default user;
