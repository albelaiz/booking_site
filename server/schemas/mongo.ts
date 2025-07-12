import { z } from 'zod';

// User schema for MongoDB
export const mongoUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email().optional(),
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'host', 'admin', 'staff']).default('user'),
  status: z.enum(['active', 'inactive']).default('active'),
  phone: z.string().optional()
});

// Property schema for MongoDB
export const mongoPropertySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10),
  price: z.number().min(0),
  priceUnit: z.enum(['night', 'week', 'month']).default('night'),
  images: z.array(z.string()).default([]),
  location: z.string().min(1),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  capacity: z.number().min(1),
  amenities: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  ownerId: z.string(),
  hostId: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'draft']).default('pending'),
  isActive: z.boolean().default(false),
  isVisible: z.boolean().default(false),
  rules: z.string().optional()
});

// Booking schema for MongoDB
export const mongoBookingSchema = z.object({
  propertyId: z.string(),
  userId: z.string(),
  checkIn: z.string().transform((str) => new Date(str)),
  checkOut: z.string().transform((str) => new Date(str)),
  guests: z.number().min(1),
  totalPrice: z.number().min(0),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).default('pending'),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional()
});

// Message schema for MongoDB
export const mongoMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
  status: z.enum(['new', 'read', 'replied', 'closed']).default('new'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  assignedTo: z.string().optional(),
  propertyId: z.string().optional()
});

// Notification schema for MongoDB
export const mongoNotificationSchema = z.object({
  userId: z.string(),
  type: z.enum(['property_review', 'property_approved', 'property_rejected', 'property_submitted', 'booking_confirmed', 'booking_cancelled']),
  title: z.string().min(1),
  message: z.string().min(1),
  propertyId: z.string().optional(),
  bookingId: z.string().optional(),
  isRead: z.boolean().default(false)
});
