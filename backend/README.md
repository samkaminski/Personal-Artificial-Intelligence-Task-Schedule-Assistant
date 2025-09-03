# Personal AI Task Schedule Assistant - Backend

A Node.js/Express backend that integrates with Google Calendar and OpenWeather API to provide calendar events and weather data for the mobile app.

## Features

- 🔐 **Google OAuth2 Integration** - Secure calendar access with read-only permissions
- 📅 **Calendar Events API** - Fetch and normalize Google Calendar events
- 🌤️ **Weather Integration** - Current and hourly forecast from OpenWeather
- 🔒 **Secure Token Storage** - OAuth tokens stored server-side (file-based for now)
- 📱 **Mobile-First API** - Designed for React Native/Expo mobile app
- 🚀 **Production Ready** - Error handling, logging, and graceful shutdown

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `env.example` to `.env` and fill in your API keys:

```bash
cp env.example .env
```

Required environment variables:

```env
# Backend Configuration
PORT=3000

# Google OAuth (read-only Calendar)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth/google/callback

# OpenWeather API
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 3. Get API Keys

#### Google Calendar API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URI to `http://localhost:3000/oauth/google/callback`
6. Download client ID and secret

#### OpenWeather API
1. Sign up at [OpenWeather](https://openweathermap.org/api)
2. Get your free API key
3. Add to `.env` file

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Server status and uptime

### Authentication
- `GET /auth/google` - Start Google OAuth flow
- `GET /oauth/google/callback` - OAuth callback handler
- `GET /session` - Check authentication status
- `POST /logout` - Clear stored tokens

### Calendar Events
- `GET /events` - Get events with optional date range
- `GET /events/today` - Get today's events
- `GET /events/upcoming` - Get next 7 days of events

**Query Parameters:**
- `from` - Start date (ISO 8601)
- `to` - End date (ISO 8601)

### Weather
- `GET /weather?lat=<number>&lon=<number>` - Get weather forecast
- `GET /weather/current?lat=<number>&lon=<number>` - Current weather only

## Data Models

### Event Object
```json
{
  "id": "string",
  "title": "string",
  "start": "ISO-8601",
  "end": "ISO-8601",
  "location": "string | null",
  "source": "google-calendar",
  "description": "string | null",
  "isAllDay": "boolean"
}
```

### Weather Summary
```json
{
  "current": {
    "tempC": 21,
    "tempF": 70,
    "condition": "Clouds",
    "description": "scattered clouds",
    "humidity": 65,
    "windSpeed": 3.2
  },
  "hourly": [
    {
      "time": "ISO-8601",
      "tempC": 20,
      "tempF": 68,
      "precipProb": 0.2,
      "condition": "Clouds"
    }
  ],
  "location": {
    "lat": 40.7128,
    "lon": -74.0060,
    "name": "America/New_York"
  }
}
```

## Architecture

```
[ Mobile App ] → [ Express Backend ] → [ Google Calendar API ]
                              ↓
                       [ OpenWeather API ]
```

### Key Components

- **`lib/googleClient.js`** - Google OAuth2 and Calendar client factory
- **`lib/tokenStore.js`** - Secure token storage (file-based, migratable to DB)
- **`lib/normalize.js`** - Data normalization for consistent API responses
- **`routes/`** - Modular route handlers for different API endpoints

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (when implemented)

### File Structure
```
backend/
├── index.js              # Main application entry point
├── package.json          # Dependencies and scripts
├── env.example          # Environment variables template
├── lib/                 # Utility libraries
│   ├── googleClient.js  # Google API client factory
│   ├── tokenStore.js    # OAuth token storage
│   └── normalize.js     # Data normalization
├── routes/              # API route handlers
│   ├── health.js        # Health check endpoint
│   ├── auth.js          # Authentication routes
│   ├── events.js        # Calendar events API
│   └── weather.js       # Weather API
└── README.md            # This file
```

## Security Features

- **OAuth2 Flow** - No client secrets exposed to mobile app
- **Token Storage** - Access tokens stored server-side only
- **CORS Protection** - Configured for development and production
- **Input Validation** - Coordinate validation for weather API
- **Error Handling** - No sensitive information leaked in errors

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
BASE_URL=https://api.your-domain.com
SESSION_SECRET=your_session_secret_here
```

### Token Storage
The current file-based token storage should be migrated to:
- **SQLite** - For single-server deployments
- **Redis** - For scalable deployments
- **Cloud KV Store** - For serverless deployments

### HTTPS
- Use HTTPS in production
- Set `Secure` and `HttpOnly` flags for cookies
- Consider using a reverse proxy (nginx) for SSL termination

## Testing

### Manual Testing
1. Start the server: `npm run dev`
2. Test health endpoint: `curl http://localhost:3000/health`
3. Test OAuth flow: Visit `http://localhost:3000/auth/google`
4. Test events endpoint: `curl http://localhost:3000/events`
5. Test weather endpoint: `curl "http://localhost:3000/weather?lat=40.7128&lon=-74.0060"`

### Automated Testing (Future)
- Unit tests for normalization functions
- Integration tests with mocked APIs
- E2E tests with the mobile app

## Troubleshooting

### Common Issues

**"Missing required Google OAuth configuration"**
- Check that all Google OAuth environment variables are set in `.env`

**"Weather API is not configured"**
- Ensure `OPENWEATHER_API_KEY` is set in `.env`

**"Token expired"**
- Re-authenticate by visiting `/auth/google` again

**CORS errors in mobile app**
- Check that your mobile app's origin is included in CORS configuration
- For real devices, use your computer's LAN IP instead of localhost

### Logs
The server logs all requests with timing information. Check the console for:
- Request/response details
- Error messages
- API call latencies

## Contributing

1. Follow the existing code structure
2. Add proper error handling for new endpoints
3. Update this README for new features
4. Test with the mobile app before submitting

## License

This project is part of the Personal AI Task Schedule Assistant.
