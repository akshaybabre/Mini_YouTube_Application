import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  categoryId: { type: Number, required: true }, 
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 }, 
  uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Video', videoSchema);