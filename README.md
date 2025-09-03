# Personal AI Task Schedule Assistant

A mobile-first intelligent assistant that aggregates your calendar, tasks, and contextual signals (weather, location) to help plan your day and provide smart notifications.

## 🚀 Project Overview

This project consists of two main components:
- **Backend API** - Node.js/Express server with Google Calendar and Weather integration
- **Mobile App** - React Native/Expo app for iOS and Android

## ✨ Features

### MVP (Current Implementation)
- 🔐 **Google Calendar Integration** - OAuth2 authentication with read-only access
- 📅 **Smart Event Display** - Normalized calendar events with location and description
- 🌤️ **Weather Context** - Current conditions and hourly forecast from OpenWeather
- 📱 **Mobile-First UI** - Beautiful, responsive design for mobile devices
- 🔒 **Secure Architecture** - Server-side OAuth token storage, no secrets on device

### Future Phases
- 🔔 **Smart Notifications** - Context-aware reminders and scheduling suggestions
- 🎯 **Task Management** - Lightweight task model with calendar integration
- 🏃 **Health Integration** - Apple Watch/Whoop data for wellness insights
- 🤖 **AI Recommendations** - Daily planning, conflict detection, and habit tracking

## 🏗️ Architecture

```
[ Mobile App (Expo/React Native) ]
              ↓ HTTP/JSON
[ Backend API (Node.js/Express) ]
              ↓
    ┌─────────────────────┐
    │ Google Calendar API │
    │ OpenWeather API     │
    └─────────────────────┘
```

- **Mobile App**: Displays events + weather, handles OAuth flow
- **Backend**: Manages OAuth tokens, proxies external APIs, normalizes data
- **External APIs**: Google Calendar (read-only), OpenWeather (forecast)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: Google OAuth2
- **APIs**: Google Calendar API, OpenWeather API
- **Storage**: File-based token storage (migratable to database)

### Mobile App
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **UI**: Native components with custom styling
- **Notifications**: Expo Notifications (push notifications ready)

## 📁 Project Structure

```
Personal-Artificial-Intelligence-Task-Schedule-Assistant/
├── backend/                    # Node.js/Express API server
│   ├── lib/                   # Utility libraries
│   │   ├── googleClient.js    # Google API client factory
│   │   ├── tokenStore.js      # OAuth token storage
│   │   └── normalize.js       # Data normalization
│   ├── routes/                # API route handlers
│   │   ├── health.js          # Health check endpoint
│   │   ├── auth.js            # Authentication routes
│   │   ├── events.js          # Calendar events API
│   │   └── weather.js         # Weather API
│   ├── index.js               # Main application entry point
│   ├── package.json           # Backend dependencies
│   ├── env.example            # Environment variables template
│   └── README.md              # Backend documentation
├── mobile-app/                 # React Native/Expo mobile app
│   ├── app/                   # Expo Router app directory
│   │   └── index.tsx          # Main home screen
│   ├── package.json           # Mobile app dependencies
│   └── app.json               # Expo configuration
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Google Cloud Console account (for Calendar API)
- OpenWeather API key (free tier available)
- Expo CLI (for mobile development)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp env.example .env

# Edit .env with your API keys
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET  
# - OPENWEATHER_API_KEY

# Start development server
npm run dev
```

The backend will be available at `http://localhost:3000`

### 2. Mobile App Setup

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# Start Expo development server
npm start
```

Use Expo Go app on your phone or run in iOS/Android simulator.

### 3. API Keys Setup

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
3. Add to backend `.env` file

## 📱 Mobile App Features

### Current Implementation
- **Beautiful UI** - Modern, card-based design with smooth animations
- **Google Calendar Auth** - Seamless OAuth flow with automatic polling
- **Event Display** - Clean event cards with time, location, and description
- **Weather Integration** - Current conditions and hourly forecast
- **Pull-to-Refresh** - Easy data refresh with visual feedback
- **Responsive Design** - Works on all screen sizes and orientations

### User Experience
- **Onboarding** - Clear instructions for connecting Google Calendar
- **Loading States** - Smooth loading animations and skeleton screens
- **Error Handling** - Friendly error messages with retry options
- **Offline Support** - Graceful degradation when APIs are unavailable

## 🔌 API Endpoints

### Authentication
- `GET /auth/google` - Start Google OAuth flow
- `GET /oauth/google/callback` - OAuth callback handler
- `GET /session` - Check authentication status
- `POST /logout` - Clear stored tokens

### Calendar Events
- `GET /events` - Get events with optional date range
- `GET /events/today` - Get today's events
- `GET /events/upcoming` - Get next 7 days of events

### Weather
- `GET /weather?lat=<number>&lon=<number>` - Get weather forecast
- `GET /weather/current?lat=<number>&lon=<number>` - Current weather only

### Health
- `GET /health` - Server status and uptime

## 🔒 Security Features

- **OAuth2 Flow** - No client secrets exposed to mobile app
- **Token Storage** - Access tokens stored server-side only
- **CORS Protection** - Configured for development and production
- **Input Validation** - Coordinate validation for weather API
- **Error Handling** - No sensitive information leaked in errors

## 🧪 Testing

### Manual Testing
1. Start backend: `cd backend && npm run dev`
2. Start mobile app: `cd mobile-app && npm start`
3. Test OAuth flow in mobile app
4. Verify events and weather display correctly

### API Testing
```bash
# Health check
curl http://localhost:3000/health

# Check auth status
curl http://localhost:3000/session

# Test weather (with coordinates)
curl "http://localhost:3000/weather?lat=40.7128&lon=-74.0060"
```

## 🚀 Deployment

### Backend Deployment
- **Platforms**: Render, Railway, Fly.io, or Cloud Run
- **Environment**: Set production environment variables
- **Database**: Migrate from file storage to persistent database
- **HTTPS**: Enable SSL/TLS for production

### Mobile App Deployment
- **iOS**: EAS Build → TestFlight → App Store
- **Android**: EAS Build → Internal Testing → Play Store
- **Push Notifications**: Configure APNs (iOS) and FCM (Android)

## 🛣️ Roadmap

### Phase 1: MVP (Current)
- ✅ Google Calendar integration
- ✅ Weather context
- ✅ Mobile UI
- ✅ OAuth authentication

### Phase 2: Enhanced UX
- 🔄 Persistent token storage
- 🔄 Error handling improvements
- 🔄 Settings and preferences
- 🔄 Location services

### Phase 3: Smart Features
- 📋 Task management
- 🔔 Push notifications
- 🎯 Daily planning suggestions
- 📊 Analytics and insights

### Phase 4: AI Integration
- 🤖 Machine learning recommendations
- 🧠 Habit tracking and analysis
- 📈 Performance optimization
- 🔮 Predictive scheduling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow existing code structure
- Add proper error handling
- Update documentation
- Test with both backend and mobile app

## 📄 License

This project is part of the Personal AI Task Schedule Assistant.

## 🆘 Support

### Common Issues

**"Missing required Google OAuth configuration"**
- Check that all Google OAuth environment variables are set in backend `.env`

**"Weather API is not configured"**
- Ensure `OPENWEATHER_API_KEY` is set in backend `.env`

**Mobile app can't connect to backend**
- Check that backend is running on correct port
- For real devices, use your computer's LAN IP instead of localhost
- Verify CORS configuration in backend

**OAuth flow not completing**
- Check redirect URI matches exactly in Google Cloud Console
- Ensure backend is accessible from your device/emulator

### Getting Help
- Check the backend and mobile app READMEs for detailed setup instructions
- Review the API documentation for endpoint details
- Test individual components to isolate issues

---

**Happy scheduling! 🎉**