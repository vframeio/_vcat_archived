import * as types from '../actions/types';

const navInitialState = { menuOpen: false };
const navReducer = (state = navInitialState, action) => {
  switch(action.type) {
    case types.OPEN_MENU:
      return { ...state, menuOpen: true };
    case types.CLOSE_MENU:
      return { ...state, menuOpen: false };
    default:
      return state;
  }
}

export default navReducer;
