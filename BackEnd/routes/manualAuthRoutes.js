import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/check-user', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    res.status(200).json({ exists: !!existingUser });
  } catch (err) {
    res.status(500).json({ message: 'Error checking user' });
  }
});

// Manual Signup Route 
router.post('/signup', async (req, res) => {
  const { userId, username, email, password } = req.body;

  if (!userId || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields (userId, username, email, password) are required' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ userId }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or UserId already exists' });
    }

    const user = await User.create({
      userId,
      username,
      email,
      password,
      role: 'user',
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email or UserId already exists' });
    }
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

// Manual Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' }); // Specific error for email
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' }); // Specific error for password
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

export default router;