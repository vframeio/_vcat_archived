import apiClient from '../util/apiClient';
import * as api from '../util/api';
import * as types from './types';

export const setUsers = (data) => {
  return { type: types.USER.SET_USERS, data }
}

export function InvalidCredentialsException(message) {
  this.message = message;
  this.name = 'InvalidCredentialsException';
}

export function index() {
  return (dispatch) => {
    apiClient()
    .get(api.USER)
    .then(function (response) {
      dispatch(setUsers(response.data));
    })
    .catch(function (error) {
      if (error.response.status === 400) {
        throw new InvalidCredentialsException(error);
      }
      throw error;
    });
  };
}
