const express = require("express");
const serverless = require("serverless-http");

const app = express();

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
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>TamudaStay - Coastal Vacation Rentals</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>
        `;

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
            message: "Server is running",
            timestamp: new Date().toISOString(),
            uptime: Math.round(process.uptime()),
            environment: process.env.NODE_ENV || "production",
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
            name: "Express Vercel App",
            version: "1.0.0",
            description: "A modern Express.js application deployed on Vercel",
            author: "Your Name",
            endpoints: [
                { path: "/", method: "GET", description: "Homepage with modern UI" },
                { path: "/api/health", method: "GET", description: "Health check endpoint" },
                { path: "/api/about", method: "GET", description: "Application information" }
            ],
            deployed: new Date().toISOString(),
            technologies: ["Express.js", "Node.js", "Vercel", "HTML5", "CSS3"]
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

// For Vercel serverless deployment
module.exports = serverless(app);
