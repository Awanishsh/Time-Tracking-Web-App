import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://time-tracking-web-app-backed-3.onrender.com/api/v1',
});

export const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

export default instance;
