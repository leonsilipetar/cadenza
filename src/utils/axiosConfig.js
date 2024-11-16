import axios from 'axios';
import { getTokens, setTokens, clearTokens } from './auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true // Important for cookies
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = getTokens();
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
          refreshToken
        });

        const { accessToken, newRefreshToken } = response.data;
        setTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 