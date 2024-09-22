const ApiConfig = {
  // Set the base URL conditionally
  baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://maiweb-server.onrender.com'
    : 'http://localhost:5000',
};

export default ApiConfig;