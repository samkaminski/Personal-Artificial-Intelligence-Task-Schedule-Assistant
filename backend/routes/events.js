const express = require('express');
const { createOAuthClient, calendarClient } = require('../lib/googleClient');
const tokenStore = require('../lib/tokenStore');
const { normalizeGoogleEvent, normalizeError } = require('../lib/normalize');
const router = express.Router();

/**
 * Get calendar events
 * GET /events?from=<iso>&to=<iso>
 */
router.get('/', async (req, res) => {
  try {
    // Check if user is authenticated
    const hasValidTokens = await tokenStore.hasValidTokens();
    if (!hasValidTokens) {
      return res.status(401).json({ 
        error: 'not_authenticated',
        message: 'Please authenticate with Google Calendar first'
      });
    }

    // Load stored tokens
    const tokens = await tokenStore.load();
    const oAuth2 = createOAuthClient(process.env);
    oAuth2.setCredentials(tokens);

    // Create calendar client
    const calendar = calendarClient(oAuth2);

    // Parse date range from query params
    const now = new Date();
    const from = req.query.from ? new Date(req.query.from) : now;
    const to = req.query.to ? new Date(req.query.to) : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Default: +7 days

    // Fetch events from Google Calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50 // Limit to prevent overwhelming response
    });

    // Normalize events
    const events = (response.data.items || []).map(normalizeGoogleEvent);

    res.json({
      events,
      meta: {
        count: events.length,
        from: from.toISOString(),
        to: to.toISOString(),
        fetchedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    
    // Handle specific Google API errors
    if (error.code === 401) {
      // Token expired or invalid
      await tokenStore.clear();
      return res.status(401).json({ 
        error: 'token_expired',
        message: 'Authentication expired. Please re-authenticate.'
      });
    }

    if (error.code === 403) {
      return res.status(403).json({ 
        error: 'calendar_access_denied',
        message: 'Access to calendar denied. Please check permissions.'
      });
    }

    // Generic error response
    res.status(503).json(normalizeError(error, 'calendar_fetch_failed'));
  }
});

/**
 * Get today's events
 * GET /events/today
 */
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    req.query.from = startOfDay.toISOString();
    req.query.to = endOfDay.toISOString();
    
    // Reuse the main events endpoint
    return router.get('/', req, res);
  } catch (error) {
    console.error('Error fetching today\'s events:', error);
    res.status(500).json(normalizeError(error, 'today_events_fetch_failed'));
  }
});

/**
 * Get upcoming events (next 7 days)
 * GET /events/upcoming
 */
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    req.query.from = now.toISOString();
    req.query.to = weekFromNow.toISOString();
    
    // Reuse the main events endpoint
    return router.get('/', req, res);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json(normalizeError(error, 'upcoming_events_fetch_failed'));
  }
});

module.exports = router;
