import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

// Admin Registration Route
router.post('/register', async (req, res) => {
  const { name, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ name });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin ID already exists' });
    }

    // Create new admin 
    const admin = new Admin({ name, password });
    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Login Route
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const admin = await Admin.findOne({ name });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid Admin ID' });
    }

    if (!(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { adminId: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


const protectAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed' });
  }
};

router.get('/profile', protectAdmin, (req, res) => {
  res.json({ name: req.admin.name });
});

export default router;