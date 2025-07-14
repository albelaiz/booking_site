# syntax=docker/dockerfile:1

### Build Stage ###
ARG NODE_VERSION=20.19.3
FROM node:${NODE_VERSION}-slim AS build

# Install native dependencies for building
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    pkg-config \
    python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files for dependency caching
COPY package.json package-lock.json* ./
COPY .npmrc* ./

# Install all dependencies (dev + prod for building)
RUN npm ci

# Copy source code
COPY . .

# Build both frontend (Vite) and backend (TypeScript)
RUN npm run build

### Production Stage ###
FROM node:${NODE_VERSION}-slim AS production

# Install only essential runtime dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    ca-certificates \
    dumb-init && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nodejs:nodejs /app/package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev && \
    npm cache clean --force

# Switch to non-root user
USER nodejs

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server/index.js"]
