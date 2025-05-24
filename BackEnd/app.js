import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

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
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'https://mini-youtube-frontend.onrender.com' // Render frontend URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Helmet CSP Configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "https://*.firebasestorage.app"], // Allow Firebase Storage for images/videos
      connectSrc: [
        "'self'",
        "https://mini-youtube-backend.onrender.com", // Backend API
        "https://*.googleapis.com", // Firebase APIs
        "wss://*.firebaseio.com" // Firebase WebSocket
      ],
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

export default app;