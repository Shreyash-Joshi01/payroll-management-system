/**
 * Centralized API Configuration
 * 
 * In production, the frontend on Vercel connects to the backend on Render.
 * In local development, it connects to localhost:5000.
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// Priority:
// 1. Explicitly set REACT_APP_API_BASE_URL env variable
// 2. Localhost defaults to port 5000
// 3. Production defaults to the Render backend URL
const RENDER_BACKEND_URL = 'https://payroll-management-system-backend.onrender.com';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (isLocalhost ? 'http://localhost:5000' : RENDER_BACKEND_URL);

export default API_BASE_URL;
