const jwt = require('jsonwebtoken');

// Hardcoded JWT secret
const JWT_SECRET = '8f9a7b3c2d5e4f1a9b8c7d6e3f2a1b9c8d7e6f5a4b3c2d1e9f8a7b6c5d4e3f';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;