const fs = require('fs').promises;
const path = require('path');

const TOKENS_FILE = path.join(__dirname, '..', 'tokens.json');

/**
 * Simple token store that persists tokens to a JSON file
 * In production, this should be replaced with a proper database
 */
class TokenStore {
  constructor() {
    this.tokens = null;
    this.loaded = false;
  }

  /**
   * Load tokens from storage
   * @returns {Object|null} Stored tokens or null if none exist
   */
  async load() {
    if (this.loaded) {
      return this.tokens;
    }

    try {
      const data = await fs.readFile(TOKENS_FILE, 'utf8');
      this.tokens = JSON.parse(data);
      this.loaded = true;
      return this.tokens;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet
        this.tokens = null;
        this.loaded = true;
        return null;
      }
      throw error;
    }
  }

  /**
   * Save tokens to storage
   * @param {Object} tokens - OAuth tokens to store
   */
  async save(tokens) {
    this.tokens = tokens;
    this.loaded = true;
    
    try {
      await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));
    } catch (error) {
      console.error('Failed to save tokens to file:', error);
      // Don't throw - tokens are still in memory
    }
  }

  /**
   * Clear stored tokens
   */
  async clear() {
    this.tokens = null;
    this.loaded = true;
    
    try {
      await fs.unlink(TOKENS_FILE);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Failed to delete tokens file:', error);
      }
    }
  }

  /**
   * Check if we have valid tokens
   * @returns {boolean} True if tokens exist and are not expired
   */
  async hasValidTokens() {
    const tokens = await this.load();
    if (!tokens || !tokens.access_token) {
      return false;
    }

    // Check if access token is expired (with 5 minute buffer)
    if (tokens.expiry_date) {
      const now = Date.now();
      const buffer = 5 * 60 * 1000; // 5 minutes
      return now < (tokens.expiry_date - buffer);
    }

    return true;
  }
}

module.exports = new TokenStore();
