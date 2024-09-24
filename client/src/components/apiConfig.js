const ApiConfig = {
  // Set the base URL conditionally
  baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://musicartincubator-cadenza.onrender.com'
    : 'http://localhost:5000',
};

export default ApiConfig;