import axios from 'axios';
import { store } from './store';
import { URL } from './api';

function getCookie(name) {
  var cookieValue = null;
  var csrfEl = document.querySelector('csrfmiddlewaretoken')
  if (csrfEl) {
    return csrfEl.value
  }
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default function apiClient() {
  const token = store.getState().auth.token;
  const csrftoken = getCookie('csrftoken');
  const headers = {
    'Accept': 'application/json',
    'Content-type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = 'Token ' + token
  }
  if (csrftoken) {
    headers['X-CSRFToken'] = csrftoken
  }
  const params = {
    baseURL: URL,
    headers
  };
  return axios.create(params);
}
