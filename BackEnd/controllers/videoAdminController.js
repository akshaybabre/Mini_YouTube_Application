import Video from '../models/Video.js';
import VideoViews from '../models/VideoViews.js';

//  Create new video
export const createVideo = async (req, res) => {
  console.log("📥 Incoming video data:", req.body);

  try {
    const { videoId, title, description, url, categoryId } = req.body;

    const newVideo = await Video.create({
      videoId,
      title,
      description,
      url,
      categoryId: Number(categoryId) 
    });

    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload video', error: error.message });
  }
};

//  Get all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    // Calculate views for each video
    const videosWithViews = await Promise.all(videos.map(async (video) => {
      const viewCount = await VideoViews.countDocuments({ videoId: video.videoId });
      return { ...video._doc, views: viewCount };
    }));
    res.status(200).json(videosWithViews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
};

//  Update video
export const updateVideo = async (req, res) => {
  try {
    if (req.body.categoryId) {
      req.body.categoryId = Number(req.body.categoryId); 
    }
    const updated = await Video.findOneAndUpdate({ videoId: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Video not found' });
    const viewCount = await VideoViews.countDocuments({ videoId: updated.videoId });
    res.json({ ...updated._doc, views: viewCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update video' });
  }
};

//  Delete video
export const deleteVideo = async (req, res) => {
  try {
    const deleted = await Video.findOneAndDelete({ videoId: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Video not found' });
    // Delete associated views
    await VideoViews.deleteMany({ videoId: req.params.id });
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete video', error: error.message });
  }
};