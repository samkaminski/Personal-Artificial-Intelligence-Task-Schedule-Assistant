const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.BASE_URL 
    : ['http://localhost:3000', 'http://localhost:19006', 'http://localhost:8081'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Health check route (always available)
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Personal AI Task Schedule Assistant API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/auth/google',
      events: '/events',
      weather: '/weather',
      session: '/session'
    }
  });
});

// Load and mount routes
console.log('📦 Loading route handlers...');

try {
  // Import route handlers
  const healthRoutes = require('./routes/health');
  const authRoutes = require('./routes/auth');
  const eventsRoutes = require('./routes/events');
  const weatherRoutes = require('./routes/weather');

  // Mount routes
  app.use('/auth', authRoutes);
  app.use('/oauth', authRoutes); // OAuth callback
  app.use('/events', eventsRoutes);
  app.use('/weather', weatherRoutes);
  app.use('/session', authRoutes);

  console.log('✅ Routes loaded successfully');
  
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  console.log('⚠️  Server will start with basic endpoints only');
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'not_found',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /health',
      'GET /auth/google',
      'GET /oauth/google/callback',
      'GET /events',
      'GET /weather',
      'GET /session',
      'POST /logout'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    error: 'internal_server_error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Personal AI Task Schedule Assistant API running on http://localhost:${port}`);
  console.log(`📅 Health check: http://localhost:${port}/health`);
  console.log(`📝 Root endpoint: http://localhost:${port}/`);
  console.log(`🔐 Google OAuth: http://localhost:${port}/auth/google`);
  console.log(`📊 Events: http://localhost:${port}/events`);
  console.log(`🌤️  Weather: http://localhost:${port}/weather`);
});

module.exports = app;
