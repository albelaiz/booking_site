import path from "path";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { seedDatabase } from "./seed.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// إعداد زيادة حجم البودي
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// سجل الـ API routes أولاً
const server = await registerRoutes(app);

// سجل اللوق للـ API
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
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

// مسار Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    endpoints: [
      "/api/properties/public",
      "/api/messages",
      "/api/bookings",
      "/api/auth/login",
    ],
  });
});

// Seed قاعدة البيانات فقط في بيئة الإنتاج
if (process.env.NODE_ENV === "production") {
  console.log("🌱 Seeding database...");
  await seedDatabase();
  console.log("✅ Database seeded successfully");
}

// خدمة ملفات الواجهة الأمامية
app.use(express.static(path.join(__dirname, "../client/dist")));

// SPA fallback - إعادة إرسال index.html لأي طلب غير مسجل
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// إدارة الأخطاء النهائية
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  }
);

// إعداد Vite أو خدمة static حسب البيئة
if (app.get("env") === "development") {
  await setupVite(app, server);
} else {
  serveStatic(app);
}

// إعداد وتشغيل السيرفر
const port = parseInt(process.env.PORT || (app.get("env") === "development" ? "5000" : "3000"));
const host = "0.0.0.0";

server.listen(port, host, () => {
  console.log(`🚀 Server running on ${host}:${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  Database: Connected to MySQL`);
  console.log(`🔗 API available at: http://${host}:${port}/api`);
  console.log(`📝 Health check: http://${host}:${port}/api/health`);
  console.log(`🏠 Properties API: http://${host}:${port}/api/properties/public`);
  log(`serving on port ${port}`);
});
