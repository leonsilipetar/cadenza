import axios from 'axios';

const ApiConfig = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://musicartincubator-cadenza.onrender.com'
    : 'http://localhost:5000',
  cookieOptions: {
    secure: true,
    sameSite: 'none',
    path: '/'
  }
};

// Add axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default ApiConfig;