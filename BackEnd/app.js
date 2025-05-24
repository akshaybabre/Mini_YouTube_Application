import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // 👈 Add this line

import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import videoAdminRoutes from './routes/videoAdminRoutes.js';
import categoryAdminRoutes from './routes/categoryAdminRoutes.js';
import userVideoRoutes from './routes/userVideoRoutes.js';
import userInteractionRoutes from './routes/userInteractionRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import userAdminRoutes from './routes/userAdminRoutes.js';
import manualAuthRoutes from './routes/manualAuthRoutes.js';
import videos from './routes/videos.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Add Helmet CSP Here
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'self'"],
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/videos', videoAdminRoutes);
app.use('/api/admin/categories', categoryAdminRoutes);
app.use('/api/admin/users', userAdminRoutes);
app.use('/api/videos', userVideoRoutes);
app.use('/api/interact', userInteractionRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/manual', manualAuthRoutes);
app.use('/api/public/videos', videos);

export default app;
