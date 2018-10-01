import * as types from '../actions/types';

const editorInitialState = {
  loading: false,
  selectedId: -1,
};
const editor = (state = editorInitialState, action) => {
  switch(action.type) {
    case types.EDITOR.SET_SELECTED_ID:
      return {
        ...state,
        selectedId: action.id,
      }
    case types.EDITOR.CLEAR_SELECTED_ID:
      return {
        ...state,
        selectedId: null,
      }
    default:
      return state;
  }
}

export default editor
