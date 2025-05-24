import express from 'express';
import Video from '../models/Video.js';
import VideoViews from '../models/VideoViews.js';
import authenticateUsers from '../middlewares/authenticateUsers.js';

const router = express.Router();

// 📺 Get All Videos or By Category
router.get('/', authenticateUsers, async (req, res) => {
  const { categoryId } = req.query;

  try {
    const filter = categoryId ? { categoryId: Number(categoryId) } : {};
    const videos = await Video.find(filter);
    const videosWithViews = await Promise.all(videos.map(async (video) => {
      const viewCount = await VideoViews.countDocuments({ videoId: video.videoId });
      return { ...video._doc, views: viewCount };
    }));
    res.json(videosWithViews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

// Increment views for all videos
router.post('/increment-all-views', authenticateUsers, async (req, res) => {
  try {
    const { videoIds } = req.body;
    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return res.status(400).json({ message: 'Invalid videoIds array' });
    }

    const updatedVideos = await Promise.all(videoIds.map(async (videoId) => {
      const video = await Video.findOne({ videoId });
      if (!video) {
        return null;
      }

      const existingView = await VideoViews.findOne({
        userId: req.user._id,
        videoId,
      });

      if (!existingView) {
        await VideoViews.create({
          userId: req.user._id,
          videoId,
        });
      }

      const viewCount = await VideoViews.countDocuments({ videoId });
      return { ...video._doc, views: viewCount };
    }));

    const validUpdatedVideos = updatedVideos.filter((video) => video !== null);
    res.json(validUpdatedVideos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to increment views' });
  }
});

export default router;