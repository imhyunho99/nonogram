// src/api/auth.js
import axios from './axiosConfig';

export const login = async (email, password) => {
  const response = await axios.post('/user/login/', {
    email: email,
    password: password,
  });

  return response.data;
};
