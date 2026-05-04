import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'https://ethara-chitti.onrender.com/api';
const baseURL = apiUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

export default api;
