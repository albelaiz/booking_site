# Express Local Server

A modern Express.js application running locally on your machine.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start the Server
```bash
npm start
```

### Development Mode (with auto-restart)
```bash
npm run watch
```

## 📍 Access Your Application

- **🏠 Homepage**: https://tamudastay.com
- **📊 Health Check**: https://tamudastay.com/api/health
- **ℹ️ About**: https://tamudastay.com/api/about

## 🛠️ Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server (same as start)
- `npm run watch` - Start with nodemon for development (auto-restart on file changes)

## 🌟 Features

- ✅ **Modern UI** - Beautiful gradient design with glass-morphism effects
- ✅ **Responsive** - Works perfectly on desktop and mobile
- ✅ **API Endpoints** - RESTful API with health check and about endpoints
- ✅ **Error Handling** - Proper error responses and logging
- ✅ **Security Headers** - Built-in security headers
- ✅ **Development Ready** - Hot-reload with nodemon

## 🔧 Configuration

The server runs on **port 3000** by default. You can change this by setting environment variables:

```bash
PORT=8080 npm start
```

## 📁 Project Structure

```
express-local-server/
├── server.js          # Main server file
├── package.json       # Project configuration
├── README.md          # This file
└── node_modules/      # Dependencies
```

## 🛑 Stopping the Server

Press `Ctrl+C` in the terminal to stop the server gracefully.

## 📝 Development Notes

- The server will automatically restart when you make changes if you use `npm run watch`
- All endpoints return JSON responses except the homepage which returns HTML
- Error handling is built-in for all routes
- Security headers are automatically set for all responses

## 🎯 API Endpoints

### GET /
Returns a beautiful HTML homepage with modern UI.

### GET /api/health
Returns server status and information:
```json
{
  "status": "OK",
  "message": "Server is running locally",
  "timestamp": "2025-07-03T15:29:00.893Z",
  "uptime": 17,
  "environment": "development",
  "version": "1.0.0",
  "server": {
    "host": "localhost",
    "port": 3000,
    "url": "https://tamudastay.com"
  }
}
```

### GET /api/about
Returns application information and available endpoints.

## 🔧 Customization

You can easily customize the server by editing `server.js`:

- Add new routes
- Modify the HTML template
- Change the styling
- Add middleware
- Connect to databases
- Add authentication

## 🚀 Next Steps

Your Express server is ready for development! You can:

1. **Add new routes** for your application
2. **Connect to a database** (MongoDB, PostgreSQL, etc.)
3. **Add authentication** (JWT, sessions, etc.)
4. **Build a full API** for your frontend
5. **Add static file serving** for CSS, JS, images
6. **Implement real-time features** with Socket.IO

Happy coding! 🎉
