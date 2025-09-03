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

// Simple test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test server working!',
    timestamp: new Date().toISOString(),
    env: {
      port: process.env.PORT,
      googleClientId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
      openWeatherKey: process.env.OPENWEATHER_API_KEY ? 'SET' : 'NOT SET'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

console.log('🚀 Starting test server...');
console.log('📝 Environment check:');
console.log(`   PORT: ${process.env.PORT || 'default 3000'}`);
console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET'}`);
console.log(`   OPENWEATHER_API_KEY: ${process.env.OPENWEATHER_API_KEY ? 'SET' : 'NOT SET'}`);

app.listen(port, () => {
  console.log(`✅ Test server running on http://localhost:${port}`);
  console.log(`🧪 Test endpoint: http://localhost:${port}/test`);
  console.log(`💚 Health check: http://localhost:${port}/health`);
});
