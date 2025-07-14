# 🏨 TamudaStay - Fly.io Deployment Guide

## 🎯 Complete Deployment Setup

Your TamudaStay booking application is now ready for Fly.io deployment with optimized multi-stage Docker build.

## 📁 Generated Files

### ✅ `Dockerfile.new`
**Multi-stage build optimized for monorepo structure:**
```dockerfile
# Stage 1: Build both frontend and backend
FROM node:20.19.3-slim AS base
- Install dependencies for root, client, and server
- Build React frontend with Vite → client/dist
- Build Node.js backend with TypeScript → server/dist

# Stage 2: Production runtime
FROM node:20.19.3-slim AS production
- Copy built server (server/dist)
- Copy built frontend (client/dist) 
- Install only production dependencies
- Serve frontend via Express backend
```

### ✅ `fly.new.toml`
**Fly.io configuration for TamudaStay:**
```toml
app = 'tamudastay'
primary_region = 'mad'  # Madrid (optimal for Morocco)
internal_port = 3000
memory = '1gb'
auto_stop_machines = true  # Cost optimization
```

### ✅ `deploy.sh`
**Automated deployment script with validation:**
- Project structure validation
- Local build testing (optional)
- Environment variable checking
- Automated Fly.io deployment

## 🏗 Build Process

### Frontend Build (React + Vite)
```bash
cd client
npm install
npm run build  # → client/dist
```

### Backend Build (Node.js + TypeScript)
```bash
cd server  
npm install
npm run build  # → server/dist
```

### Docker Integration
```dockerfile
# Copy built frontend to be served by Express
COPY --from=base /app/client/dist ./client/dist

# Copy built backend
COPY --from=base /app/server/dist ./server/dist

# Start Express server (serves frontend + API)
CMD ["node", "dist/index.js"]
```

## 🚀 Deployment Steps

### 1. Prepare Files
```bash
# Replace your current files with the new ones
mv Dockerfile.new Dockerfile
mv fly.new.toml fly.toml
mv .dockerignore.new .dockerignore
```

### 2. Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### 3. Login to Fly.io
```bash
fly auth login
```

### 4. Create App (if needed)
```bash
fly apps create tamudastay
```

### 5. Set Environment Variables
```bash
fly secrets set DATABASE_URL="your_neon_postgres_url"
fly secrets set NODE_ENV="production"
```

### 6. Deploy with Script
```bash
./deploy.sh
```

Or deploy manually:
```bash
fly deploy
```

## 🔧 Express Server Configuration

Your Express server should be configured to:

### Serve Static Frontend
```javascript
// Serve built React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
```

### API Routes
```javascript
// API routes (should come before static serving)
app.use('/api', apiRoutes);
app.use('/health', healthCheck);
```

## 🏨 Project Structure in Container

```
/app/
├── server/
│   ├── dist/           # Built TypeScript server
│   │   └── index.js    # Entry point
│   └── package.json    # Server dependencies
├── client/
│   └── dist/           # Built React app
│       ├── index.html  # SPA entry point
│       └── assets/     # JS/CSS bundles
└── shared/             # Shared TypeScript types
```

## 📊 Health Checks & Monitoring

### Health Endpoints
```javascript
// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ api: 'ok', database: 'connected' });
});
```

### Fly.io Monitoring
- **Health checks**: GET `/health` every 30s
- **Auto-scaling**: Machines start/stop based on traffic
- **Logs**: `fly logs -f`
- **Status**: `fly status`

## 🗄 Database Integration

### Neon PostgreSQL Setup
```bash
# Set your database connection
fly secrets set DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

### Migration on Deploy
```toml
[deploy]
  release_command = 'cd server && npm run db:migrate'
```

## 🔍 Troubleshooting

### Build Issues
```bash
# Test local build
./deploy.sh --test-build

# Check Docker build locally
docker build -t tamudastay:test .
```

### Runtime Issues
```bash
# View logs
fly logs -f

# SSH into container
fly ssh console

# Check app status
fly status
```

### Common Fixes
- Ensure Express serves static files from `../client/dist`
- Verify TypeScript builds to `server/dist`
- Check Vite builds to `client/dist`
- Confirm all paths are relative to working directory

## ✅ Production Features

### Performance Optimizations
- **Multi-stage build**: Smaller production image
- **Asset optimization**: Vite bundles and minifies
- **Dependency pruning**: Only production deps in final image
- **Auto-scaling**: Cost-effective resource usage

### Security Features
- **HTTPS**: Automatic SSL certificates
- **Environment variables**: Secure secret management
- **Container isolation**: Sandboxed runtime
- **Health monitoring**: Automatic restart on failures

## 🎉 Ready to Deploy!

Your TamudaStay booking application is now configured for production deployment on Fly.io:

1. **Replace configuration files** with the new ones
2. **Run `./deploy.sh`** for automated deployment
3. **Access your live app** at your Fly.io domain

Your full-stack React + Node.js booking platform is ready to serve guests! 🏨✨
