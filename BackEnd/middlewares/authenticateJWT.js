import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('JWT Auth: User found:', user);
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT auth error:', err.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default authenticateJWT;