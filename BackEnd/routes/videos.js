import express from 'express';
import authenticateUsers from '../middlewares/authenticateUsers.js';
import Video from '../models/Video.js';
import VideoViews from '../models/VideoViews.js';

const router = express.Router();

// Get all videos for authenticated users with search functionality
router.get('/', authenticateUsers, async (req, res) => {
  try {
    const searchQuery = req.query.search || ''; 
    let videos;

    if (searchQuery) {
      // Case-insensitive search on title and description
      videos = await Video.find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ],
      });
    } else {
      videos = await Video.find();
    }

    // Calculate views for each video 
    const videosWithViews = await Promise.all(videos.map(async (video) => {
      const viewCount = await VideoViews.countDocuments({ videoId: video.videoId });
      return { ...video._doc, views: viewCount };
    }));

    res.json(videosWithViews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;