import mongoose from 'mongoose';

  const videoViewsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videoId: { type: String, required: true },
    viewedAt: { type: Date, default: Date.now }
  }, { timestamps: true });

  export default mongoose.model('VideoViews', videoViewsSchema);