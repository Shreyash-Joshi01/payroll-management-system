/**
 * Centralized API Configuration
 * 
 * Automatically detects if the app is running in a local environment or on Vercel.
 * Provides a unified API_BASE URL to avoid repeating environment variable logic.
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// Priority:
// 1. Explicitly set env variable
// 2. Localhost defaults to 5000 (standard for this project)
// 3. Vercel/Production defaults to /api (proxied via vercel.json)
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (isLocalhost ? 'http://localhost:5000' : '/api');

export default API_BASE_URL;
