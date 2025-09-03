const { google } = require('googleapis');

/**
 * Creates an OAuth2 client for Google APIs
 * @param {Object} config - Configuration object with OAuth credentials
 * @returns {google.auth.OAuth2} OAuth2 client instance
 */
function createOAuthClient({ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI }) {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error('Missing required Google OAuth configuration');
  }
  
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

/**
 * Creates a Google Calendar client using the provided OAuth2 client
 * @param {google.auth.OAuth2} oauth2Client - Authenticated OAuth2 client
 * @returns {google.calendar_v3.Calendar} Calendar client instance
 */
function calendarClient(oauth2Client) {
  if (!oauth2Client) {
    throw new Error('OAuth2 client is required');
  }
  
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

module.exports = { createOAuthClient, calendarClient };
