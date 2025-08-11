// src/api/auth.js
import axios from './axiosConfig';

export const login = async (email, password) => {
  const response = await axios.post('/user/login/', {
    email,
    password,
  });

  return response.data;
};