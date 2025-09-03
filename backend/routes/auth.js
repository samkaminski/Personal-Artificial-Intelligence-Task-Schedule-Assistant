const express = require('express');
const { createOAuthClient } = require('../lib/googleClient');
const tokenStore = require('../lib/tokenStore');
const router = express.Router();

/**
 * Start Google OAuth flow
 * GET /auth/google
 */
router.get('/google', (req, res) => {
  try {
    const oAuth2 = createOAuthClient(process.env);
    
    const authUrl = oAuth2.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/calendar.readonly']
    });

    res.redirect(authUrl);
  } catch (error) {
    console.error('Failed to generate auth URL:', error);
    res.status(500).json({ 
      error: 'auth_configuration_error',
      message: 'Authentication configuration error'
    });
  }
});

/**
 * OAuth callback handler
 * GET /oauth/google/callback
 */
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('OAuth error:', error);
    return res.status(400).json({ 
      error: 'oauth_error',
      message: 'OAuth authorization failed'
    });
  }

  if (!code) {
    return res.status(400).json({ 
      error: 'missing_code',
      message: 'Authorization code is required'
    });
  }

  try {
    const oAuth2 = createOAuthClient(process.env);
    const { tokens } = await oAuth2.getToken(code);
    
    // Store tokens securely
    await tokenStore.save(tokens);
    
    // For mobile apps, redirect to a deep link or return success
    // For now, return success response that mobile can handle
    res.json({ 
      success: true, 
      message: 'Successfully authenticated with Google Calendar',
      authenticated: true
    });
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    res.status(500).json({ 
      error: 'token_exchange_failed',
      message: 'Failed to exchange authorization code for tokens'
    });
  }
});

/**
 * Logout endpoint
 * POST /logout
 */
router.post('/logout', async (req, res) => {
  try {
    await tokenStore.clear();
    res.json({ 
      success: true, 
      message: 'Successfully logged out',
      authenticated: false
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ 
      error: 'logout_failed',
      message: 'Failed to logout'
    });
  }
});

/**
 * Check authentication status
 * GET /session
 */
router.get('/session', async (req, res) => {
  try {
    const hasValidTokens = await tokenStore.hasValidTokens();
    res.json({ 
      authenticated: hasValidTokens,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking session:', error);
    res.status(500).json({ 
      error: 'session_check_failed',
      message: 'Failed to check authentication status'
    });
  }
});

module.exports = router;
