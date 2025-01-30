const ApiConfig = {
  baseUrl:
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://musicartincubator-cadenza.onrender.com",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  },
};

export default ApiConfig;
