#!/bin/bash
echo "🚀 Starting booking site for Railway deployment..."

# Build the application
echo "📦 Building TypeScript server..."
npm run build:server

echo "🏗️  Building Vite client..."
npm run build:client

echo "🌱 Seeding database..."
npm run db:seed

echo "🎯 Starting production server..."
npm start
