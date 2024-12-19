// When setting cookies
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true in production
  sameSite: 'strict',
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? '.your-domain.com' : 'localhost'
});