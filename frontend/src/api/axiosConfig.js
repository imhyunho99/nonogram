// src/api/axiosConfig.js
import axios from 'axios';

axios.defaults.baseURL = '/';
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ default export 추가
export default axios;
