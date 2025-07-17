// src/api/auth.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Django 서버 주소 (배포 시 수정)

export const login = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/user/login/`, {
    email,
    password,
  });

  return response.data;
};
