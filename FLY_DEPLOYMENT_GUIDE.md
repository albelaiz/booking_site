# Fly.io Deployment Guide - Full-Stack Booking App

## 🚀 Complete Fly.io Setup

Your booking application is now fully configured for Fly.io deployment with optimized Docker configuration.

## 📁 Configuration Files

### ✅ Dockerfile
```dockerfile
# Multi-stage build optimized for Fly.io
FROM node:20.19.3-slim AS base
WORKDIR /app
ENV NODE_ENV="production"

# Build stage
FROM base AS build
RUN apt-get update && apt-get install -y build-essential python-is-python3
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --omit=dev

# Production stage
FROM base
COPY --from=build /app /app
EXPOSE 3000
CMD ["npm", "start"]
```

### ✅ fly.toml
```toml
app = 'booking-site'
primary_region = 'dfw'

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  
[vm]
  memory = '1gb'
  cpu_kind = 'shared'
  cpus = 1
```

### ✅ .dockerignore
- Excludes node_modules, development files, and build artifacts
- Optimized for faster Docker builds
- Reduces image size significantly

## 🔧 Key Features

### Multi-Stage Build
1. **Base Stage**: Node.js 20.19.3 slim image
2. **Build Stage**: Install dependencies, compile TypeScript, build client
3. **Production Stage**: Copy built app, remove dev dependencies

### Fly.io Optimizations
- **Auto-scaling**: Starts/stops machines based on traffic
- **Health Checks**: GET request to `/` endpoint
- **HTTPS**: Force HTTPS with automatic certificates
- **Memory**: 1GB RAM with shared CPU (cost-optimized)

### Build Process
```bash
npm install          # Install all dependencies
npm run build        # Build server + client
npm prune --omit=dev # Remove dev dependencies
npm start           # Start production server
```

## 🚀 Deployment Steps

### 1. Install Fly.io CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Login to Fly.io
```bash
fly auth login
```

### 3. Create App (if needed)
```bash
fly apps create booking-site
```

### 4. Set Environment Variables
```bash
fly secrets set DATABASE_URL="your_neon_postgres_url"
fly secrets set NODE_ENV="production"
```

### 5. Deploy
```bash
fly deploy
```

### 6. Open Your App
```bash
fly open
```

## 🔍 Health & Monitoring

### Health Checks
- **Path**: `/` (your app's main route)
- **Interval**: Every 30 seconds
- **Timeout**: 5 seconds
- **Grace Period**: 10 seconds on startup

### Scaling
```bash
fly scale count 1          # Set number of machines
fly scale memory 1024      # Set memory per machine
fly status                 # Check app status
```

### Logs
```bash
fly logs                   # View recent logs
fly logs -f               # Follow logs in real-time
```

## 🗄️ Database Setup

### Neon PostgreSQL
Your app is configured to work with Neon PostgreSQL:
```bash
# Set your database URL
fly secrets set DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

### Migrations
```bash
fly ssh console -C "npm run db:migrate"
```

## 📊 Performance Features

### Docker Optimizations
- **Multi-stage build**: Reduces final image size
- **Layer caching**: Faster subsequent builds
- **Production dependencies only**: Smaller runtime image

### Fly.io Features
- **Edge deployment**: Apps deploy close to users
- **Auto-scaling**: Scale to zero when not in use
- **Built-in load balancing**: Handle traffic spikes
- **Global anycast**: Fast DNS resolution

## 🛠 Troubleshooting

### Build Issues
```bash
fly logs                   # Check build logs
fly doctor                # Diagnose common issues
```

### Database Connection
```bash
fly ssh console           # SSH into your app
fly proxy 5432            # Proxy database port locally
```

### App Not Starting
- Check `npm start` works locally
- Verify PORT environment variable
- Check health check endpoint

## ✅ Production Ready

Your booking app is now configured with:
- ✅ Node.js 20+ with TypeScript compilation
- ✅ Multi-stage Docker build for optimization
- ✅ Fly.io auto-scaling and health checks
- ✅ PostgreSQL database integration
- ✅ Production environment variables
- ✅ HTTPS with automatic certificates
- ✅ Cost-optimized resource allocation

Deploy with `fly deploy` and your full-stack booking application will be live! 🎉
