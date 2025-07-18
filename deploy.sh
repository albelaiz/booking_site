#!/bin/bash

# Production deployment script for Vite + React + Express app
# This script builds the app and deploys it to Fly.io

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI not found. Please install it first:"
    echo "   curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --no-cache

# Build the application
echo "🔨 Building application..."
echo "  - Building server..."
npm run build:server

echo "  - Building client..."
npm run build:client

# Verify build output
echo "📋 Verifying build output..."
if [ ! -d "dist/public" ]; then
    echo "❌ dist/public directory not found!"
    echo "   Make sure 'npm run build:client' completed successfully"
    exit 1
fi

if [ ! -f "dist/public/index.html" ]; then
    echo "❌ dist/public/index.html not found!"
    echo "   Make sure Vite build completed successfully"
    exit 1
fi

# Check for assets
ASSETS_COUNT=$(find dist/public/assets -name "*.css" -o -name "*.js" 2>/dev/null | wc -l)
if [ "$ASSETS_COUNT" -eq 0 ]; then
    echo "❌ No CSS/JS assets found in dist/public/assets/"
    echo "   Make sure Vite build generated assets correctly"
    exit 1
fi

echo "✅ Build verification passed!"
echo "   - Found index.html"
echo "   - Found $ASSETS_COUNT asset files"

# Deploy to Fly.io
echo "🚁 Deploying to Fly.io..."
fly deploy --no-cache

echo "✅ Deployment completed successfully!"
echo "🌐 Your app should be available at: https://white-sun-1985.fly.dev"
echo ""
echo "🔧 Troubleshooting tips:"
echo "   - Check logs: fly logs"
echo "   - Check status: fly status"
echo "   - Open app: fly open"
echo "   - SSH into app: fly ssh console"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    print_error "Fly CLI is not installed. Please install it first:"
    echo "curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if logged in to fly
if ! fly auth whoami &> /dev/null; then
    print_error "Not logged in to Fly.io. Please run: fly auth login"
    exit 1
fi

# Validate project structure
print_status "Validating project structure..."

if [ ! -d "client" ]; then
    print_error "client directory not found"
    exit 1
fi

if [ ! -d "server" ]; then
    print_error "server directory not found"
    exit 1
fi

if [ ! -f "client/package.json" ]; then
    print_error "client/package.json not found"
    exit 1
fi

if [ ! -f "server/package.json" ]; then
    print_error "server/package.json not found"
    exit 1
fi

print_success "Project structure validated"

# Test local build (optional)
if [ "$1" = "--test-build" ]; then
    print_status "Testing local build..."
    
    print_status "Building frontend..."
    cd client
    npm run build
    cd ..
    
    print_status "Building backend..."
    cd server
    npm run build
    cd ..
    
    print_success "Local build test completed"
fi

# Set environment variables (prompt user)
print_status "Checking environment variables..."

echo "Please ensure you have set the following secrets in Fly.io:"
echo "- DATABASE_URL (your Neon PostgreSQL connection string)"
echo "- Any other required environment variables"
echo ""
read -p "Have you set all required secrets? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Please set your secrets first:"
    echo "fly secrets set DATABASE_URL=\"your_neon_postgres_url\""
    echo "Then run this script again."
    exit 1
fi

# Deploy to Fly.io
print_status "Deploying TamudaStay to Fly.io..."

if fly deploy; then
    print_success "Deployment completed successfully!"
    echo ""
    print_status "Your app is now available at:"
    fly status --json | grep -o '"hostname":"[^"]*"' | cut -d'"' -f4 | head -1 | xargs -I {} echo "https://{}"
    echo ""
    print_status "Useful commands:"
    echo "- View logs: fly logs -f"
    echo "- Check status: fly status"
    echo "- Open app: fly open"
    echo "- SSH into app: fly ssh console"
else
    print_error "Deployment failed. Check the logs for details."
    exit 1
fi
