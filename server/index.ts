import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes, setStorageBackend } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectMongoDB } from "./config/mongodb";
import { mongoStorage } from "./storage/mongoStorage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  let mongoConnected = false;
  
  // Try to connect to MongoDB, but don't fail if it's not available
  try {
    await connectMongoDB();
    await mongoStorage.seedDatabase();
    setStorageBackend(true); // Use MongoDB
    mongoConnected = true;
    console.log('🎉 MongoDB migration active - using MongoDB storage');
  } catch (error) {
    console.log('⚠️  MongoDB not available, using original PostgreSQL system');
    console.log('   To use MongoDB: Set MONGODB_URI environment variable or start local MongoDB');
    setStorageBackend(false); // Use PostgreSQL
    mongoConnected = false;
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on port 80 for Replit environment
  // this serves both the API and the client.
  const port = process.env.PORT || (app.get("env") === "development" ? 5000 : 80);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();