import axios from 'axios';

import { getToken, logout } from './auth';

const api = axios.create({
  baseURL: 'https://surfart-homolog.herokuapp.com/api'
});

api.interceptors.response.use(
  (response) => {
    // Do something with response data

    return response;
  },
  (error) => {
    // Do something with response error

    // You can even test for a response code
    // and try a new request before rejecting the promise

    if (
      error.request._hasError === true &&
      error.request._response.includes('connect')
    ) {
      alert(
        'Não foi possível conectar aos nossos servidores, sem conexão a internet'
      );
    }

    if (error.response.status === 401) {
      const requestConfig = error.config;
      console.log('eae error')
      console.log(error)
      // O token JWT expirou

      logout()
      window.location.replace('/login');

      return axios(requestConfig);
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if(token) {
      config.headers.Authorization = token
    }
    return Promise.resolve(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
