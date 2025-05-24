import express from 'express';
import Video from '../models/Video.js';
import VideoViews from '../models/VideoViews.js';
import authenticateUsers from '../middlewares/authenticateUsers.js';

const router = express.Router();

// 👍 Like a Video (Toggle Behavior)
router.post('/:id/like', authenticateUsers, async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.id });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id.toString();
    const hasLiked = video.likes.some(id => id.toString() === userId);
    const hasDisliked = video.dislikes.some(id => id.toString() === userId);

    if (hasLiked) {
      video.likes = video.likes.filter(id => id.toString() !== userId);
    } else {
      if (hasDisliked) {
        video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
      }
      video.likes.push(userId);
    }

    await video.save();

    const viewCount = await VideoViews.countDocuments({ videoId: video.videoId });
    res.json({ ...video._doc, views: viewCount });
  } catch (err) {
    res.status(500).json({ message: 'Like failed' });
  }
});

// 👎 Dislike a Video (Toggle Behavior)
router.post('/:id/dislike', authenticateUsers, async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.id });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id.toString();
    const hasLiked = video.likes.some(id => id.toString() === userId);
    const hasDisliked = video.dislikes.some(id => id.toString() === userId);

    if (hasDisliked) {
      video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
    } else {
      if (hasLiked) {
        video.likes = video.likes.filter(id => id.toString() !== userId);
      }
      video.dislikes.push(userId);
    }

    await video.save();

    const viewCount = await VideoViews.countDocuments({ videoId: video.videoId });
    res.json({ ...video._doc, views: viewCount });
  } catch (err) {
    res.status(500).json({ message: 'Dislike failed' });
  }
});

export default router;