import axios from 'axios';
import ApiConfig from '../components/apiConfig.js';

export const refreshToken = async () => {
  try {
    const response = await axios.post(`${ApiConfig.baseUrl}/api/refresh`, null, { withCredentials: true });
    const newToken = response.data.token;
    localStorage.setItem('auth_token', newToken); // Update token in local storage
    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};