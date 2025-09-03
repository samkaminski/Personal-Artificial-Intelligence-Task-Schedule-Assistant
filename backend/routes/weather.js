const express = require('express');
const axios = require('axios');
const { normalizeWeatherData, normalizeError } = require('../lib/normalize');
const router = express.Router();

/**
 * Get weather forecast
 * GET /weather?lat=<number>&lon=<number>
 */
router.get('/', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    // Validate coordinates
    if (!lat || !lon) {
      return res.status(400).json({
        error: 'missing_coordinates',
        message: 'Latitude (lat) and longitude (lon) are required'
      });
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (isNaN(latNum) || isNaN(lonNum)) {
      return res.status(400).json({
        error: 'invalid_coordinates',
        message: 'Latitude and longitude must be valid numbers'
      });
    }

    if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      return res.status(400).json({
        error: 'coordinates_out_of_range',
        message: 'Latitude must be between -90 and 90, longitude between -180 and 180'
      });
    }

    // Check if API key is configured
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'weather_api_not_configured',
        message: 'Weather API is not configured'
      });
    }

    // Fetch weather data from OpenWeather
    const response = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
      params: {
        lat: latNum,
        lon: lonNum,
        appid: apiKey,
        units: 'metric',
        exclude: 'minutely,daily,alerts'
      },
      timeout: 10000 // 10 second timeout
    });

    // Normalize the weather data
    const weatherSummary = normalizeWeatherData(response.data);

    res.json(weatherSummary);

  } catch (error) {
    console.error('Error fetching weather data:', error);

    // Handle specific OpenWeather API errors
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        return res.status(500).json({
          error: 'weather_api_key_invalid',
          message: 'Invalid weather API key'
        });
      }
      
      if (status === 429) {
        return res.status(503).json({
          error: 'weather_api_rate_limited',
          message: 'Weather API rate limit exceeded. Please try again later.'
        });
      }
      
      if (status === 400) {
        return res.status(400).json({
          error: 'weather_api_bad_request',
          message: 'Invalid coordinates provided to weather service'
        });
      }
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(503).json({
        error: 'weather_api_timeout',
        message: 'Weather service request timed out. Please try again.'
      });
    }

    // Generic error response
    res.status(503).json(normalizeError(error, 'weather_fetch_failed'));
  }
});

/**
 * Get weather for a specific location (by coordinates)
 * GET /weather/location?lat=<number>&lon=<number>
 */
router.get('/location', async (req, res) => {
  // This is an alias for the main weather endpoint
  return router.get('/', req, res);
});

/**
 * Get current weather only
 * GET /weather/current?lat=<number>&lon=<number>
 */
router.get('/current', async (req, res) => {
  try {
    // First get the full weather data
    const fullWeather = await router.get('/', req, res);
    
    // If there was an error, it's already been sent
    if (fullWeather.error) {
      return;
    }
    
    // Extract just the current weather
    const currentWeather = {
      current: fullWeather.current,
      location: fullWeather.location,
      fetchedAt: new Date().toISOString()
    };
    
    res.json(currentWeather);
    
  } catch (error) {
    console.error('Error fetching current weather:', error);
    res.status(500).json(normalizeError(error, 'current_weather_fetch_failed'));
  }
});

module.exports = router;
