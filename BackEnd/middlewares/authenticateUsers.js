import admin from '../config/firebaseAdmin.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateUsers = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { uid, email, name } = decodedToken;

      let user = await User.findOne({ $or: [{ firebaseUID: uid }, { email }] });
      if (!user) {
        user = await User.create({
          userId: uid,
          firebaseUID: uid,
          email: email,
          username: name || email.split('@')[0],
          role: 'user',
        });
      }

      req.user = user;
      req.authType = 'firebase';
      return next();
    } catch (firebaseErr) {
      console.log('Firebase auth failed, trying JWT:', firebaseErr.message);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    req.authType = 'jwt';
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default authenticateUsers;