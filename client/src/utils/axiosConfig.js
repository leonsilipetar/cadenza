import axios from 'axios';
import { isPWA, getPWAUser } from './pwaUtils';
import { getToken } from './tokenUtils';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Get token based on client type
    const token = isPWA() ? 
      localStorage.getItem('pwa_token') : 
      getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && isPWA()) {
      // Clear PWA auth and redirect to login
      clearPWAUser();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 