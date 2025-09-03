const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path}`);
  next();
});

// Health check route
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
    name: 'Debug Server',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

console.log('🚀 Starting debug server...');

// Test route loading step by step
console.log('📦 Step 1: Loading health routes...');
try {
  const healthRoutes = require('./routes/health');
  app.use('/health-debug', healthRoutes);
  console.log('✅ Health routes mounted at /health-debug');
} catch (error) {
  console.error('❌ Health routes failed:', error.message);
}

console.log('📦 Step 2: Loading auth routes...');
try {
  const authRoutes = require('./routes/auth');
  app.use('/auth-debug', authRoutes);
  console.log('✅ Auth routes mounted at /auth-debug');
} catch (error) {
  console.error('❌ Auth routes failed:', error.message);
}

console.log('📦 Step 3: Loading events routes...');
try {
  const eventsRoutes = require('./routes/events');
  app.use('/events-debug', eventsRoutes);
  console.log('✅ Events routes mounted at /events-debug');
} catch (error) {
  console.error('❌ Events routes failed:', error.message);
}

console.log('📦 Step 4: Loading weather routes...');
try {
  const weatherRoutes = require('./routes/weather');
  app.use('/weather-debug', weatherRoutes);
  console.log('✅ Weather routes mounted at /weather-debug');
} catch (error) {
  console.error('❌ Weather routes failed:', error.message);
}

// Start server
app.listen(port, () => {
  console.log(`✅ Debug server running on http://localhost:${port}`);
  console.log(`🧪 Test endpoints:`);
  console.log(`   /health - Basic health check`);
  console.log(`   /health-debug - Health routes test`);
  console.log(`   /auth-debug/google - Auth routes test`);
  console.log(`   /events-debug - Events routes test`);
  console.log(`   /weather-debug - Weather routes test`);
});
