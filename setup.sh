#!/bin/bash

echo "🚀 Setting up Personal AI Task Schedule Assistant..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found. Please ensure you're in the project root."
    exit 1
fi

echo "📦 Installing backend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit backend/.env with your API keys:"
    echo "   - GOOGLE_CLIENT_ID"
    echo "   - GOOGLE_CLIENT_SECRET"
    echo "   - OPENWEATHER_API_KEY"
else
    echo "✅ .env file already exists"
fi

cd ..

# Setup Mobile App
echo ""
echo "📱 Setting up Mobile App..."
cd mobile-app

if [ ! -f "package.json" ]; then
    echo "❌ Mobile app package.json not found. Please ensure you're in the project root."
    exit 1
fi

echo "📦 Installing mobile app dependencies..."
npm install

cd ..

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo ""
    echo "⚠️  Expo CLI is not installed. Installing globally..."
    npm install -g @expo/cli
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your API keys"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start mobile app: cd mobile-app && npm start"
echo ""
echo "📚 For detailed setup instructions, see:"
echo "   - README.md (main project)"
echo "   - backend/README.md (backend specific)"
echo ""
echo "🔑 Get your API keys from:"
echo "   - Google Cloud Console: https://console.cloud.google.com/"
echo "   - OpenWeather: https://openweathermap.org/api"
echo ""
echo "Happy coding! 🚀"
