import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const AI_BASE_URL = process.env.EXPO_PUBLIC_AI_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiApi = axios.create({
  baseURL: AI_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

aiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('AI API Error:', error.response.data);
    } else if (error.request) {
      console.error('AI Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);
