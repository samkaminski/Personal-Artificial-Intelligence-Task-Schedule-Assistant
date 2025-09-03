console.log('🧪 Testing route loading...');

try {
  console.log('📦 Loading health routes...');
  const healthRoutes = require('./routes/health');
  console.log('✅ Health routes loaded');
  
  console.log('📦 Loading auth routes...');
  const authRoutes = require('./routes/auth');
  console.log('✅ Auth routes loaded');
  
  console.log('📦 Loading events routes...');
  const eventsRoutes = require('./routes/events');
  console.log('✅ Events routes loaded');
  
  console.log('📦 Loading weather routes...');
  const weatherRoutes = require('./routes/weather');
  console.log('✅ Weather routes loaded');
  
  console.log('🎉 All routes loaded successfully!');
  
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  console.error('Stack trace:', error.stack);
}
