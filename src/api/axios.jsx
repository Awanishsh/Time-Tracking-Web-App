import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

export const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

export default instance;
