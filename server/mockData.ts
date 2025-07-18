import type { User, Property, Booking, Message, AuditLog } from "@shared/schema";

// Mock data for development when database is unavailable
export const mockUsers: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    password: "$2b$10$example", // This would be hashed in real implementation
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    name: "Admin User",
    phone: null
  },
  {
    id: 2,
    username: "host1",
    email: "host1@example.com", 
    password: "$2b$10$example",
    role: "owner",
    status: "active",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
    name: "Host One",
    phone: null
  }
];

export const mockProperties: Property[] = [
  {
    id: 1,
    title: "Cozy Downtown Apartment",
    description: "A beautiful 2-bedroom apartment in the heart of the city",
    price: "120.00",
    priceUnit: "night",
    location: "Downtown, City Center",
    amenities: ["WiFi", "Kitchen", "Parking", "Air Conditioning"],
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"],
    capacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    ownerId: 2,
    status: "approved",
    featured: true, // Make this featured for testing
    rating: "4.5",
    reviewCount: 12,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: 2,
    title: "Seaside Villa",
    description: "Luxury villa with ocean views and private beach access",
    price: "350.00",
    priceUnit: "night",
    location: "Coastal Area, Beach Front",
    amenities: ["WiFi", "Pool", "Beach Access", "Garden", "Parking"],
    images: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"],
    capacity: 8,
    bedrooms: 4,
    bathrooms: 3,
    ownerId: 2,
    status: "approved",
    featured: true,
    rating: "4.8",
    reviewCount: 25,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  }
];

export const mockBookings: Booking[] = [
  {
    id: 1,
    propertyId: 1,
    userId: 1,
    checkIn: new Date("2024-07-20"),
    checkOut: new Date("2024-07-25"),
    amount: "600.00",
    status: "confirmed",
    guests: 2,
    createdAt: new Date("2024-07-10"),
    updatedAt: new Date("2024-07-10"),
    guestName: "John Doe",
    guestEmail: "john@example.com",
    guestPhone: "+1234567890",
    comments: null
  }
];

export const mockMessages: Message[] = [
  {
    id: 1,
    name: "System",
    email: "system@tamudastay.com",
    subject: "Welcome",
    message: "Welcome to TamudaStay! How can I help you today?",
    status: "new",
    createdAt: new Date("2024-07-16"),
    updatedAt: new Date("2024-07-16")
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    userId: 1,
    action: "property_approved",
    entity: "properties",
    entityId: 1,
    oldValues: null,
    newValues: JSON.stringify({ status: "approved" }),
    createdAt: new Date("2024-07-16"),
    ipAddress: "127.0.0.1",
    userAgent: "Development",
    severity: "info",
    description: "Property approved by admin"
  }
];
