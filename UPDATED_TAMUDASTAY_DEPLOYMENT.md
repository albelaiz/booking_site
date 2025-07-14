# 🏨 TamudaStay - Updated Fly.io Deployment

## 🎯 Deployment Configuration

Updated files for your exact project structure with separate `/client` and `/server` directories.

## 📁 Build Process

### Frontend Build (`/client`)
```bash
cd client
npm install    # Installs vite, TypeScript, etc.
npm run build  # Creates client/dist with built React app
```

### Backend Build (`/server`) 
```bash
cd server
npm install    # Installs TypeScript compiler, etc.
npm run build  # Compiles TypeScript to server/dist/index.js
```

### Docker Integration
```dockerfile
# 1. Install dependencies (including devDependencies for vite, tsc)
WORKDIR /app/client
RUN npm install

WORKDIR /app/server  
RUN npm install

# 2. Build frontend
WORKDIR /app/client
RUN npm run build  # → client/dist

# 3. Copy frontend to server's public directory
RUN mkdir -p server/public && cp -r client/dist/* server/public/

# 4. Build backend  
WORKDIR /app/server
RUN npm run build  # → server/dist

# 5. Production: Copy server/dist and server/public
COPY --from=base /app/server/dist ./dist
COPY --from=base /app/server/public ./public
```

## 📋 File Structure in Container

```
/app/
├── dist/              # Compiled TypeScript server
│   └── index.js       # Entry point: node dist/index.js
├── public/            # Built React frontend (copied from client/dist)
│   ├── index.html     # React SPA entry
│   └── assets/        # JS, CSS bundles
└── package.json       # Server production dependencies
```

## 🚀 Updated Files

### ✅ `Dockerfile.new`
**Key Changes:**
- Installs devDependencies in build stage (for `vite`, `tsc`)
- Builds frontend: `client/` → `client/dist`
- Copies frontend to: `server/public/`
- Builds backend: `server/src/` → `server/dist/`
- Production stage: Only `server/dist/` and `server/public/`
- Entry point: `node dist/index.js` (from `/app` directory)

### ✅ `fly.new.toml`
**Key Changes:**
- Process command: `node dist/index.js` (simplified)
- Health checks: `/` and `/api/health`
- Port 3000 exposed correctly
- Auto-scaling enabled for cost optimization

### ✅ `server-example.ts`
**Express Server Configuration:**
```typescript
// Serve static files from /public (copied during Docker build)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// SPA routing fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});
```

## 🔧 Express Server Setup

Your `server/src/index.ts` should serve static files from the `/public` directory:

```typescript
import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// API routes first
app.use('/api', yourApiRoutes);

// Serve built React app from /public
app.use(express.static(path.join(__dirname, '../public')));

// SPA fallback for React Router
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏨 TamudaStay running on port ${PORT}`);
});
```

## 📦 Package.json Scripts

### Client (`/client/package.json`)
```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Server (`/server/package.json`)
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.0.0"
  }
}
```

## 🚀 Deployment Steps

### 1. Replace Configuration Files
```bash
mv Dockerfile.new Dockerfile
mv fly.new.toml fly.toml
```

### 2. Deploy to Fly.io
```bash
# Set environment variables
fly secrets set DATABASE_URL="your_database_url"

# Deploy
fly deploy

# Open your app
fly open
```

## ✅ Production Ready Features

### Build Optimizations
- **DevDependencies**: Installed during build for `vite` and `tsc`
- **Multi-stage**: Smaller production image (only runtime files)
- **Static serving**: Built React app served efficiently by Express
- **SPA routing**: Proper fallback to `index.html`

### Fly.io Features  
- **Auto-scaling**: Machines start/stop based on traffic
- **Health checks**: Multiple endpoints monitored
- **HTTPS**: Automatic SSL certificates
- **Port 3000**: Correctly exposed and configured

Your TamudaStay booking application is now configured to:
1. **Build frontend** with Vite in Docker
2. **Copy frontend** to server's public directory  
3. **Build backend** with TypeScript compiler
4. **Serve everything** from a single Express server
5. **Deploy seamlessly** to Fly.io

The setup handles your exact folder structure with separate client/server builds! 🏨✨
