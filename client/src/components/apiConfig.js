const ApiConfig = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://musicartincubator-cadenza.onrender.com'
    : 'http://localhost:5000',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  }
};

export default ApiConfig;