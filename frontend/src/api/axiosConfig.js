// src/api/axiosConfig.js
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // ✅ 1. uuid import 추가

axios.defaults.baseURL = '/api/';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const requestId = uuidv4();
  config.headers['X-Request-ID'] = requestId; // 헤더에 고유 ID 추가
  config.metadata = { startTime: new Date() }; // 요청 시작 시간 기록
  console.log(`[FE Log] Request Start: ${config.method.toUpperCase()} ${config.url} (ID: ${requestId})`);

  return config;
});

axios.interceptors.response.use(

  (response) => {
    const { config } = response;
    config.metadata.endTime = new Date();
    const duration = config.metadata.endTime.getTime() - config.metadata.startTime.getTime();

    console.log(
      `[FE Log] Request End (Success): ${config.url} | Total Time: ${duration}ms (ID: ${config.headers['X-Request-ID']})`
    );

    return response;
  },
  (error) => {
    const { config } = error;

    if (config?.metadata) {
      config.metadata.endTime = new Date();
      const duration = config.metadata.endTime.getTime() - config.metadata.startTime.getTime();

      console.error(
        `[FE Log] Request End (Error): ${config.url} | Total Time: ${duration}ms (ID: ${config.headers['X-Request-ID']})`
      );
    } else {
      console.error(`[FE Log] Network or other error occurred:`, error.message);
    }

    return Promise.reject(error);
  }
);

export default axios;