# 🏠 Booking Site - Rental Platform

A modern rental booking platform built with React, Node.js, and PostgreSQL.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** (Neon) for data storage
- **Passport.js** for authentication

## 📁 Project Structure

```
booking_site/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utility functions
│   │   └── data/           # Static data
│   └── public/             # Static assets
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database connection
│   ├── seed.ts            # Database seeding
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema
└── supabase/              # Database migrations (legacy)
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+ (LTS)
- pnpm (recommended) or npm
- PostgreSQL database (we use Neon)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd booking_site
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other configurations
   ```

3. **Set up the database:**
   ```bash
   # Push database schema
   pnpm db:push
   
   # Seed with initial data
   pnpm db:seed
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

## 📜 Available Scripts

### Development
- `pnpm dev` - Start development server
- `pnpm check` - Run TypeScript type checking
- `pnpm preview` - Preview production build

### Database
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)
- `pnpm db:seed` - Seed database with initial data

### Build & Deploy
- `pnpm build` - Build for production
- `pnpm start` - Start production server

## 🏗️ Architecture

### Database Schema
- **Users**: Authentication and user management
- **Properties**: Rental listings with images, amenities
- **Bookings**: Reservation management
- **Messages**: Communication system

### Key Features
- 🔐 User authentication (admin, staff, owner, user roles)
- 🏠 Property listing and management
- 📅 Booking system with calendar integration
- 💬 Messaging between guests and owners
- 🎨 Modern responsive UI
- 📱 Mobile-friendly design
- 🔍 Search and filtering
- ⭐ Rating and review system

## 🌐 Deployment

The application is configured for deployment on platforms like:
- Replit
- Vercel
- Railway
- Render

Database is hosted on [Neon](https://neon.tech) for serverless PostgreSQL.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
