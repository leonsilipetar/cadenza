export const getToken = () => {
  let token = localStorage.getItem('auth_token');
  if (!token) {
    const match = document.cookie.match(/(^|;)\s*token=([^;]+)/);
    if (match) {
      token = match[2];
    }
  }
  return token;
}; 