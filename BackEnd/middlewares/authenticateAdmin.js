import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js'; // Change from User to Admin

const authenticateAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    req.user = admin; 
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default authenticateAdmin;