// Example Express server configuration for TamudaStay
// This shows how to serve the built React frontend from /public directory

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (must come BEFORE static file serving)
// app.use('/api', apiRoutes); // Your API routes would go here

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    app: 'TamudaStay',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Database health check
app.get('/api/health', (req, res) => {
  // Check database connection here
  res.json({ 
    api: 'ok', 
    database: 'connected', // Or check actual DB status
    environment: process.env.NODE_ENV 
  });
});

// Serve static files from built React app (copied to /public during Docker build)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Handle React Router (SPA) - must be AFTER API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏨 TamudaStay server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});

export default app;
