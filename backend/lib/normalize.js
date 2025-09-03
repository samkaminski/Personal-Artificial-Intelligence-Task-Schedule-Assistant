/**
 * Normalizes Google Calendar events to a consistent format
 * @param {Object} googleEvent - Raw Google Calendar event
 * @returns {Object} Normalized event object
 */
function normalizeGoogleEvent(googleEvent) {
  const start = googleEvent.start?.dateTime || googleEvent.start?.date;
  const end = googleEvent.end?.dateTime || googleEvent.end?.date;
  
  return {
    id: googleEvent.id,
    title: googleEvent.summary || 'Untitled Event',
    start: start,
    end: end,
    location: googleEvent.location || null,
    source: 'google-calendar',
    description: googleEvent.description || null,
    isAllDay: !googleEvent.start?.dateTime,
    raw: googleEvent // Keep raw data for debugging
  };
}

/**
 * Normalizes OpenWeather forecast data to a consistent format
 * @param {Object} weatherData - Raw OpenWeather API response
 * @returns {Object} Normalized weather summary
 */
function normalizeWeatherData(weatherData) {
  const current = weatherData.current;
  const hourly = weatherData.hourly?.slice(0, 24) || []; // Next 24 hours
  
  return {
    current: {
      tempC: Math.round(current?.temp || 0),
      tempF: Math.round((current?.temp || 0) * 9/5 + 32),
      condition: current?.weather?.[0]?.main || 'Unknown',
      description: current?.weather?.[0]?.description || 'Unknown',
      humidity: current?.humidity || 0,
      windSpeed: current?.wind_speed || 0
    },
    hourly: hourly.map(hour => ({
      time: new Date(hour.dt * 1000).toISOString(),
      tempC: Math.round(hour.temp || 0),
      tempF: Math.round((hour.temp || 0) * 9/5 + 32),
      precipProb: hour.pop || 0, // Probability of precipitation (0-1)
      condition: hour.weather?.[0]?.main || 'Unknown',
      description: hour.weather?.[0]?.description || 'Unknown'
    })),
    location: {
      lat: weatherData.lat,
      lon: weatherData.lon,
      name: weatherData.timezone || 'Unknown'
    }
  };
}

/**
 * Normalizes error responses to a consistent format
 * @param {Error} error - Error object
 * @param {string} context - Context where the error occurred
 * @returns {Object} Normalized error response
 */
function normalizeError(error, context = 'unknown') {
  return {
    error: true,
    message: error.message || 'An unknown error occurred',
    context,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  normalizeGoogleEvent,
  normalizeWeatherData,
  normalizeError
};
