import axios from 'axios';
import ApiConfig from '../components/apiConfig.js';
import { getToken } from './tokenUtils';

export const refreshToken = async () => {
  const token = getToken();
  try {
    const response = await axios.post(`${ApiConfig.baseUrl}/api/refresh`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    const newToken = response.data.token;
    localStorage.setItem('auth_token', newToken);
    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};