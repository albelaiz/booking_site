# BayHaven - Vacation Rental Platform

## Overview

BayHaven is a modern vacation rental platform built for coastal properties. The application is a full-stack web application that combines a React frontend with an Express.js backend, utilizing PostgreSQL for data persistence through Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Moroccan-themed color palette
- **State Management**: React Context API for global state (Properties, Bookings)
- **Routing**: React Router for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Data Layer**: DatabaseStorage class implementing IStorage interface
- **API**: RESTful endpoints for users, properties, and bookings
- **Development**: TSX for TypeScript execution in development
- **Build System**: esbuild for production bundling

### Project Structure
```
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React Context providers
│   │   ├── pages/       # Route components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions and API client
├── server/          # Express.js backend
│   ├── routes.ts    # API route definitions
│   ├── storage.ts   # Data access layer with memory fallback
│   └── vite.ts      # Vite development server integration
├── shared/          # Shared TypeScript definitions
│   └── schema.ts    # Drizzle database schema
└── migrations/      # Database migration files
```

## Key Components

### Database Schema
- **Users Table**: Complete user management with roles (admin, staff, owner, user)
- **Properties Table**: Full property listings with images, pricing, and status workflow
- **Bookings Table**: Comprehensive booking system with guest details and payment tracking
- **Relations**: Proper foreign key relationships between users, properties, and bookings

### Authentication System
- **Multi-role Support**: Admin, Staff, Owner, and Customer roles
- **Mock Authentication**: Currently uses in-memory user store with default accounts
- **Session Management**: Browser localStorage for session persistence

### Property Management
- **CRUD Operations**: Full property lifecycle management
- **Status Workflow**: Pending → Approved/Rejected moderation flow
- **Rich Media**: Multi-image support for property listings
- **Detailed Attributes**: Bedrooms, bathrooms, capacity, amenities, pricing

### User Interfaces
- **Public Portal**: Property browsing, search, and booking
- **Admin Dashboard**: Full system administration capabilities
- **Staff Dashboard**: Property and booking management
- **Owner Dashboard**: Property owner self-service portal

### API Architecture
- **RESTful Design**: Conventional REST endpoints under `/api` prefix
- **Error Handling**: Centralized error handling middleware
- **Request Logging**: Detailed API request/response logging
- **Graceful Degradation**: Fallback to mock data when API unavailable

## Data Flow

### Property Listing Flow
1. Owner creates property through dashboard
2. Property enters "pending" status
3. Admin/Staff reviews and approves/rejects
4. Approved properties appear in public listings

### Booking Flow
1. Guest searches and selects property
2. Booking request submitted with guest details
3. Booking enters "pending" status
4. Staff confirms booking
5. Payment processing (placeholder implementation)

### User Management Flow
1. User registration/login through auth modal
2. Role-based dashboard redirection
3. Session persistence across browser sessions

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Router, React Hook Form
- **UI Components**: Radix UI primitives, shadcn/ui component library
- **Database**: Drizzle ORM, Neon Database serverless client
- **Development**: Vite, TypeScript, ESBuild

### Third-party Services
- **Database Hosting**: Neon Database (PostgreSQL)
- **Deployment**: Replit platform with autoscale deployment
- **CDN**: Unsplash for placeholder property images
- **Icons**: Lucide React icon library

### Development Tools
- **Build**: Vite for development server and production builds
- **Database Migrations**: Drizzle Kit for schema management
- **TypeScript**: Full type safety across frontend and backend
- **Linting**: Built-in TypeScript compiler checks

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Port**: Application serves on port 5000
- **Hot Reload**: Vite HMR for frontend, TSX watch mode for backend
- **Database**: Uses DATABASE_URL environment variable

### Production Build
- **Frontend Build**: Vite builds optimized static assets
- **Backend Build**: ESBuild bundles server code to `dist/index.js`
- **Deployment**: Replit autoscale deployment target
- **Environment**: NODE_ENV=production for production optimizations

### Configuration Requirements
- **DATABASE_URL**: PostgreSQL connection string (required)
- **Node.js**: Version 20+ required for ES modules support
- **PostgreSQL**: Version 16 for full compatibility

### Replit Integration
- **Modules**: nodejs-20, web, postgresql-16
- **Port Mapping**: Internal port 5000 → External port 80
- **Build Process**: `npm run build` → `npm run start`
- **Development**: Integrated with Replit's workflow system

## Changelog
- June 14, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.