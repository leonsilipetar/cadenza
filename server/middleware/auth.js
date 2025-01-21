const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication failed: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userId = decoded.id;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: "Token expired",
          code: "TOKEN_EXPIRED"
        });
      }
      return res.status(401).json({ message: "Authentication failed: Invalid token" });
    }
  };