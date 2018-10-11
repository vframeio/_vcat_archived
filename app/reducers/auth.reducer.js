import * as types from '../actions/types';

const authInitialState = {
  token: null,
  user: {},
  groups: {},
  loading: false,
  isAuthenticated: false,
};
const auth = (state = authInitialState, action) => {
  switch(action.type) {
    case types.AUTH.SET_TOKEN:
      return {
        ...state,
        token: action.data,
        isAuthenticated: !!action.data,
        loading: false,
        error: null,
      };

    case types.AUTH.AUTH_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.AUTH.SET_CURRENT_USER:
      const groups = {}
      action.data.groups.forEach(g => groups[g.name.toLowerCase()] = true)
      if (action.data.is_staff) {
        groups['staff'] = true
      }
      if (action.data.is_superuser) {
        groups['superuser'] = true
      }
      return {
        ...state,
        user: action.data,
        groups,
        error: null,
      };

    case types.AUTH.LOGOUT_USER:
      return {
        ...authInitialState
      };

    case types.AUTH.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.data,
      }

    case types.REHYDRATE:
      const initial_state_el = document.querySelector('#initial_state')
      if (initial_state_el) {
        try {
          const initial_state = JSON.parse(initial_state_el.innerHTML)
          if (initial_state && initial_state.auth && initial_state.auth.user) {
            console.log(initial_state.auth.user)
            return {
              ...state,
              user: {
                ...initial_state.auth.user,
              }
            }
          }
        } catch (e) {
          console.error("error loading initial state")
        }
      }
      return state;

    default:
      return state;
  }
}

export default auth;
