import express from 'express';
import authenticateFirebaseUser from '../middlewares/authenticateUsers.js';
const router = express.Router();

router.post('/login', authenticateFirebaseUser, async (req, res) => {
  res.status(200).json({
    message: 'User authenticated successfully',
    user: {
      id: req.user._id,
      userId: req.user.userId,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

router.get('/me', authenticateFirebaseUser, (req, res) => {
  res.json({
    id: req.user._id,
    userId: req.user.userId,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
  });
});

router.post('/delete-firebase-user', async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ message: 'UID is required' });
  }

  try {
    await deleteFirebaseUser(uid);
    res.status(200).json({ message: 'Firebase user deleted successfully' });
  } catch (err) {
    console.error('Error deleting Firebase user:', err);
    res.status(500).json({ message: 'Failed to delete Firebase user' });
  }
});

export default router;