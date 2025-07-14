const express = require("express");
const app = express();

// Server configuration
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

app.get("/", (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        const currentDate = new Date().toLocaleString('en-US', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const htmlPage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Express Local Server - Welcome</title>
            <style>
                /* styles omitted for brevity — keep as-is */
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Express Local Server</h1>
                <p>Welcome to your Express.js application running on Railway!</p>
                <span class="status">✅ Live & Running</span>

                <div class="server-info">
                    <strong>🖥️ Server Info:</strong><br>
                    Running on: Railway<br>
                    Environment: ${process.env.NODE_ENV || 'development'}
                </div>

                <div class="features">
                    <div class="feature">
                        <h3>⚡ Fast</h3>
                        <p>Built with Express.js for optimal performance</p>
                    </div>
                    <div class="feature">
                        <h3>🔧 Cloud Hosting</h3>
                        <p>Running on Railway cloud platform</p>
                    </div>
                    <div class="feature">
                        <h3>🛠️ Customizable</h3>
                        <p>Easy to modify and extend for your needs</p>
                    </div>
                </div>

                <div style="margin-top: 2rem;">
                    <a href="/api/health" class="btn">📊 API Health Check</a>
                    <a href="/api/about" class="btn">ℹ️ About</a>
                </div>

                <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.7;">
                    🔗 Server started at ${currentDate}
                </p>
            </div>
        </body>
        </html>`;
        res.send(htmlPage);
    } catch (error) {
        console.error('Error rendering homepage:', error);
        res.status(500).send('<h1>Error loading page</h1><p>Please try again later.</p>');
    }
});

app.get("/api/health", (req, res) => {
    try {
        res.json({
            status: "OK",
            message: "Server is running on Railway",
            timestamp: new Date().toISOString(),
            uptime: Math.round(process.uptime()),
            environment: process.env.NODE_ENV || "development",
            version: "1.0.0"
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            status: "ERROR",
            message: "Health check failed"
        });
    }
});

app.get("/api/about", (req, res) => {
    try {
        res.json({
            name: "Express App on Railway",
            version: "1.0.0",
            description: "A modern Express.js app hosted on Railway",
            author: "Your Name",
            endpoints: [
                { path: "/", method: "GET", description: "Homepage with modern UI" },
                { path: "/api/health", method: "GET", description: "Health check endpoint" },
                { path: "/api/about", method: "GET", description: "Application information" }
            ],
            environment: process.env.NODE_ENV || "development",
            started: new Date().toISOString()
        });
    } catch (error) {
        console.error('About endpoint error:', error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Unable to retrieve application information"
        });
    }
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        error: "Internal Server Error",
        message: "Something went wrong on the server",
        timestamp: new Date().toISOString()
    });
});

// 404 handler (must be last)
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `The endpoint ${req.path} does not exist`,
        method: req.method,
        availableEndpoints: [
            { path: "/", method: "GET", description: "Homepage" },
            { path: "/api/health", method: "GET", description: "Health check" },
            { path: "/api/about", method: "GET", description: "About information" }
        ],
        timestamp: new Date().toISOString()
    });
});

// ✅ FIXED: Start the server on the correct port for Railway
app.listen(PORT, () => {
    console.log('🚀 Express Server is running!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🌍 Hosted on Railway`);
});
