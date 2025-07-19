import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes placeholder - add your API routes here
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Serve static files from dist/public (Vite build output)
const distPath = path.join(__dirname, 'dist', 'public');
app.use(express.static(distPath, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    // Cache static assets for longer
    if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }

  // Serve index.html for all other routes (React Router)
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const port = parseInt(process.env.PORT || '3000');
const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log(`🚀 Server running on ${host}:${port}`);
  console.log(`📁 Serving static files from: ${distPath}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
});