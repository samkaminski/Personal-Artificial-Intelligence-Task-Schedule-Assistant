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
    name: 'Personal AI Task Schedule Assistant API (Minimal)',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    note: 'Google OAuth routes disabled for testing'
  });
});

console.log('🚀 Starting minimal server...');
console.log('📝 Environment loaded successfully');

app.listen(port, () => {
  console.log(`✅ Minimal server running on http://localhost:${port}`);
  console.log(`💚 Health check: http://localhost:${port}/health`);
  console.log(`📝 Root endpoint: http://localhost:${port}/`);
});
