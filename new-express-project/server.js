const express = require("express");
const app = express();

// Server configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

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
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            
            .container {
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 3rem;
                border-radius: 20px;
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
                border: 1px solid rgba(255, 255, 255, 0.18);
                max-width: 600px;
                margin: 2rem;
            }
            
            h1 {
                font-size: 3rem;
                margin-bottom: 1rem;
                background: linear-gradient(45deg, #fff, #f0f0f0);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            p {
                font-size: 1.2rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }
            
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin-top: 2rem;
            }
            
            .feature {
                background: rgba(255, 255, 255, 0.1);
                padding: 1.5rem;
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .feature h3 {
                margin-bottom: 0.5rem;
                color: #fff;
            }
            
            .feature p {
                font-size: 0.9rem;
                margin-bottom: 0;
            }
            
            .btn {
                display: inline-block;
                padding: 12px 24px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                transition: all 0.3s ease;
                margin: 0.5rem;
            }
            
            .btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
            }
            
            .status {
                display: inline-block;
                padding: 4px 8px;
                background: #10b981;
                color: white;
                border-radius: 4px;
                font-size: 0.8rem;
                margin-left: 0.5rem;
            }
            
            .server-info {
                background: rgba(255, 255, 255, 0.1);
                padding: 1rem;
                border-radius: 10px;
                margin-top: 2rem;
                font-size: 0.9rem;
            }
            
            @media (max-width: 768px) {
                h1 { font-size: 2rem; }
                .container { padding: 2rem; margin: 1rem; }
                .features { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Express Local Server</h1>
            <p>Welcome to your Express.js application running locally!</p>
            <span class="status">✅ Live & Running</span>
            
            <div class="server-info">
                <strong>🖥️ Server Info:</strong><br>
                Running on: http://${HOST}:${PORT}<br>
                Environment: ${process.env.NODE_ENV || 'development'}
            </div>
            
            <div class="features">
                <div class="feature">
                    <h3>⚡ Fast</h3>
                    <p>Built with Express.js for optimal performance</p>
                </div>
                <div class="feature">
                    <h3>🔧 Local Development</h3>
                    <p>Running on your local machine for development</p>
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
            message: "Server is running locally",
            timestamp: new Date().toISOString(),
            uptime: Math.round(process.uptime()),
            environment: process.env.NODE_ENV || "development",
            version: "1.0.0",
            server: {
                host: HOST,
                port: PORT,
                url: `http://${HOST}:${PORT}`
            }
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
            name: "Express Local Server",
            version: "1.0.0",
            description: "A modern Express.js application running locally",
            author: "Your Name",
            endpoints: [
                { path: "/", method: "GET", description: "Homepage with modern UI" },
                { path: "/api/health", method: "GET", description: "Health check endpoint" },
                { path: "/api/about", method: "GET", description: "Application information" }
            ],
            server: {
                host: HOST,
                port: PORT,
                url: `http://${HOST}:${PORT}`,
                environment: process.env.NODE_ENV || "development"
            },
            started: new Date().toISOString(),
            technologies: ["Express.js", "Node.js", "HTML5", "CSS3"]
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

// Start the server
app.listen(PORT, HOST, () => {
    console.log('🚀 Express Server is running!');
    console.log(`📍 Local URL: http://${HOST}:${PORT}`);
    console.log(`🌍 Network URL: http://localhost:${PORT}`);
    console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('📊 Health Check: /api/health');
    console.log('ℹ️  About: /api/about');
    console.log('🛑 To stop: Ctrl+C');
    console.log('─'.repeat(50));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM. Gracefully shutting down...');
    process.exit(0);
});

module.exports = app;
