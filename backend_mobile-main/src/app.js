const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

// Route files
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const tripRoutes = require('./routes/trip.routes');
const tourRoutes = require('./routes/tour.routes');
const placeRoutes = require('./routes/place.routes');
const blogRoutes = require('./routes/blog.routes');
const experienceRoutes = require('./routes/experience.routes');
const fellowRoutes = require('./routes/fellow.routes');
const chatRoutes = require('./routes/chat.routes');
const photoRoutes = require('./routes/photo.routes');

const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security & CORS
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// ROOT ROUTE
app.get('/', (_, res) => {
  res.json({
    success: true,
    message: 'VIU API is running',
    version: '1.1.0'
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/places', placeRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/experiences', experienceRoutes);
app.use('/api/v1/fellows', fellowRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/photos', photoRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
