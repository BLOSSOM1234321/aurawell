import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import supportGroupRoutes from './routes/supportGroups.js';
import supportRoomRoutes from './routes/supportRooms.js';
import messageRoutes from './routes/messages.js';
import moodRoutes from './routes/moods.js';
import journalRoutes from './routes/journals.js';
import meditationRoutes from './routes/meditations.js';
import reelRoutes from './routes/reels.js';
import roomPostsRoutes from './routes/roomPosts.js';
import moderationRoutes from './routes/moderation.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN === '*' ? '*' : (process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'capacitor://localhost', 'http://localhost']),
  credentials: true
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 500, // Limit each IP to 500 requests per minute
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AuraWell API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support-groups', supportGroupRoutes);
app.use('/api/support-rooms', supportRoomRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/meditations', meditationRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/room-posts', roomPostsRoutes);
app.use('/api/moderation', moderationRoutes);

// ============================================
// ERROR HANDLING
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const startServer = async () => {
  try {
    // Test database connection
    const connected = await testConnection();

    if (!connected) {
      console.error('❌ Failed to connect to database. Server not started.');
      process.exit(1);
    }

    // Start listening
    app.listen(PORT, () => {
      console.log('\n===========================================');
      console.log(`🚀 AuraWell API Server Running`);
      console.log(`===========================================`);
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Base URL: http://localhost:${PORT}`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log('===========================================\n');
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();

export default app;
