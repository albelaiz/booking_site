import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { seedDatabase } from "./seed.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Increase payload limit for property images and data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  console.log('🎉 Starting server with MySQL database');

  // Seed the database with initial data in production
  if (process.env.NODE_ENV === 'production') {
    console.log('🌱 Seeding database...');
    await seedDatabase();
    console.log('✅ Database seeded successfully');
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      endpoints: [
        '/api/properties/public',
        '/api/messages',
        '/api/bookings',
        '/api/auth/login'
      ]
    });
  });

  // Setup Vite in development or serve static files in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Railway-compatible server configuration
  const port = parseInt(process.env.PORT || (app.get("env") === "development" ? "5000" : "3000"));
  const host = "0.0.0.0";

  server.listen(port, host, () => {
    console.log(`🚀 Server running on ${host}:${port}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: Connected to MySQL`);
    console.log(`🔗 API available at: http://${host}:${port}/api`);
    console.log(`📝 Health check: http://${host}:${port}/api/health`);
    console.log(`🏠 Properties API: http://${host}:${port}/api/properties/public`);
    log(`serving on port ${port}`);
  });
})();