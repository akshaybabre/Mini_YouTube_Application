import express from 'express';
import Watchlist from '../models/Watchlist.js';
import Video from '../models/Video.js';
import VideoViews from '../models/VideoViews.js';
import authenticateUsers from '../middlewares/authenticateUsers.js';

const router = express.Router();

// Add to Watchlist
router.post('/:videoId', authenticateUsers, async (req, res) => {
  try {
    const exists = await Watchlist.findOne({ userId: req.user.userId, videoId: req.params.videoId });
    if (exists) return res.status(400).json({ message: 'Already in watchlist' });

    const entry = await Watchlist.create({ userId: req.user.userId, videoId: req.params.videoId });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Add to watchlist failed' });
  }
});

//  Remove from Watchlist
router.delete('/:videoId', authenticateUsers, async (req, res) => {
  try {
    const deleted = await Watchlist.findOneAndDelete({ userId: req.user.userId, videoId: req.params.videoId });
    if (!deleted) return res.status(404).json({ message: 'Not in watchlist' });
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ message: 'Remove from watchlist failed' });
  }
});

// Get Watchlist
router.get('/', authenticateUsers, async (req, res) => {
  try {
    const list = await Watchlist.find({ userId: req.user.userId });
    const videos = await Promise.all(list.map(async (entry) => {
      const video = await Video.findOne({ videoId: entry.videoId });
      if (video) {
        const viewCount = await VideoViews.countDocuments({ videoId: video.videoId });
        return { ...video._doc, views: viewCount };
      }
      return null;
    }));
    res.json(videos.filter(video => video !== null));
  } catch (err) {
    res.status(500).json({ message: 'Fetch watchlist failed' });
  }
});

export default router;