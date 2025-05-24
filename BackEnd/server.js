  import dotenv from 'dotenv';
  import mongoose from 'mongoose';
  import app from './app.js';

  dotenv.config();

  const PORT = process.env.PORT || 5000;
  const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-YT';

  mongoose.connect(MONGO_URI).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error(' MongoDB connection failed:', err.message);
  });