app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://mai-cadenza.onrender.com' 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
})); 