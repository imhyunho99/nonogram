// src/api/axiosConfig.js
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

axios.defaults.baseURL = 'https://nonogram.duckdns.org/api/';

axios.interceptors.request.use((config) => {
  const publicPaths = ['/user/register/', '/user/login/'];

  const token = localStorage.getItem('access');

  if (token && !publicPaths.includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const requestId = uuidv4();
  config.headers['X-Request-ID'] = requestId;
  config.metadata = { startTime: new Date() };
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
