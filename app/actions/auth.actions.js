import apiClient from '../util/apiClient';
import * as api from '../util/api';
import * as types from './types';

export const setToken = (data) => {
  return { type: types.AUTH.SET_TOKEN, data }
}
export const setError = (data) => {
  return { type: types.AUTH.SET_ERROR, data }
}
export const setCurrentUser = (data) => {
  return { type: types.AUTH.SET_CURRENT_USER, data }
}
export function logout() {
  return { type: types.AUTH.LOGOUT_USER };
}
export function authLoading() {
  return { type: types.AUTH.AUTH_LOADING };
}

export function InvalidCredentialsException(message) {
  this.message = message;
  this.name = 'InvalidCredentialsException';
}

export function login(username, password) {
  return (dispatch) => {
    dispatch(authLoading());
    apiClient()
    .post(api.GET_TOKEN, {
      username,
      password
    })
    .then(function (response) {
      dispatch(setToken(response.data.token));
      dispatch(getCurrentUser());
    })
    .catch(function (error) {
      dispatch(setError(true));
      if (error.response.status === 400) {
        throw new InvalidCredentialsException(error);
      }
      throw error;
    });
  };
}

export function signup(data) {
  return (dispatch) => {
    dispatch(authLoading());
    apiClient()
    .post(api.SIGNUP, data)
    .then(function (response) {
      console.log(response.data);
      dispatch(login(data.username, data.password));
    })
    .catch(function (error) {
      console.log(error)
      if (error.response.status === 400) {
        // dispatch(accountError("There was an error creating your account."))
        throw new InvalidCredentialsException(error);
      }
      throw error;
    });
  };
}

export function getCurrentUser() {
  return (dispatch) => {
    dispatch(authLoading());
    apiClient()
    .get(api.CURRENT_USER)
    .then(function (response) {
      dispatch(setCurrentUser(response.data));
      console.log('set current user')
    })
    .catch(function (error) {
      if (error.response.status === 400) {
        throw new InvalidCredentialsException(error);
      }
      throw error;
    });
  };
}
