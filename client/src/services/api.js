import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthFormRequest = /\/api\/auth\/(login|register)(?:\?|$)/.test(requestUrl);
    const status = error.response?.status;

    if (isAuthFormRequest) {
      return Promise.reject(error);
    }

    const messages = {
      400: error.response?.data?.message || 'Please check the information and try again.',
      401: 'Your session has expired. Please sign in again.',
      404: 'The requested item could not be found.',
      500: 'The server encountered a problem. Please try again shortly.',
    };
    const message = messages[status] || (error.response
      ? error.response.data?.message || 'The request could not be completed.'
      : 'Unable to reach the server. Check your connection and try again.');

    if (status === 401) {
      localStorage.removeItem('token');
    }

    window.dispatchEvent(new CustomEvent('app:api-error', {
      detail: { message, status, unauthorized: status === 401 },
    }));

    return Promise.reject(error);
  }
);

export default api;
