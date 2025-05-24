import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  videoId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;