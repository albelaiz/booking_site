import { db } from "./db.js";
import { users, properties, bookings, messages, auditLogs } from "@shared/schema";
import { eq, and, desc, or, gte, lte, ne } from "drizzle-orm";
import type { User, Property, Booking, Message, AuditLog } from "@shared/schema";
import { FallbackStorage } from "./fallbackStorage.js";
import { logFallbackMode } from "./devUtils.js";

// Global flag to track if we should use fallback storage
let useFallbackStorage = false;
let fallbackStorageInstance: FallbackStorage | null = null;

// Export function to check fallback status
export function isFallbackStorageActive(): boolean {
  return useFallbackStorage;
}

// Function to check if error is due to quota limits
function isQuotaError(error: any): boolean {
  const errorMessage = error?.message || '';
  return errorMessage.includes('exceeded the data transfer quota') ||
         errorMessage.includes('quota') ||
         errorMessage.includes('limit exceeded');
}

// Function to get appropriate storage instance
function getStorageInstance(): FallbackStorage | null {
  if (useFallbackStorage) {
    if (!fallbackStorageInstance) {
      logFallbackMode();
      fallbackStorageInstance = new FallbackStorage();
    }
    return fallbackStorageInstance;
  }
  return null;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;
  updateUser(id: number, user: any): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  getApprovedProperty(id: number): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  getApprovedProperties(): Promise<Property[]>;
  getPropertiesByOwner(ownerId: number): Promise<Property[]>;
  createProperty(property: any): Promise<Property>;
  updateProperty(id: number, property: any): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  getBookingsByProperty(propertyId: number): Promise<Booking[]>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getUserBookingForProperty(userId: number, propertyId: number): Promise<Booking | undefined>;
  getBookedDatesForProperty(propertyId: number): Promise<{ checkIn: Date, checkOut: Date }[]>;
  checkBookingAvailability(propertyId: number, checkIn: Date, checkOut: Date, excludeBookingId?: number): Promise<boolean>;
  createBooking(booking: any): Promise<Booking>;
  updateBooking(id: number, booking: any): Promise<Booking | undefined>;
  createOrUpdateBooking(booking: any): Promise<Booking>;
  
  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  getAllMessages(): Promise<Message[]>;
  createMessage(message: any): Promise<Message>;
  updateMessage(id: number, message: any): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;

  // Audit Log methods
  createAuditLog(auditLog: any): Promise<AuditLog>;
  getAuditLogs(filters?: {
    userId?: number;
    action?: string;
    entity?: string;
    severity?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]>;
  getAuditLogsByUser(userId: number): Promise<AuditLog[]>;
  getRecentAuditLogs(limit?: number): Promise<AuditLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const fallback = getStorageInstance();
    if (fallback) return fallback.getUser(id);
    
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching user:', error);
      if (isQuotaError(error)) {
        useFallbackStorage = true;
        const fallback = getStorageInstance();
        if (fallback) return fallback.getUser(id);
      }
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const fallback = getStorageInstance();
    if (fallback) return fallback.getUserByUsername(username);
    
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      if (isQuotaError(error)) {
        useFallbackStorage = true;
        const fallback = getStorageInstance();
        if (fallback) return fallback.getUserByUsername(username);
      }
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const fallback = getStorageInstance();
    if (fallback) return fallback.getUserByEmail(email);
    
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      if (isQuotaError(error)) {
        useFallbackStorage = true;
        const fallback = getStorageInstance();
        if (fallback) return fallback.getUserByEmail(email);
      }
      return undefined;
    }
  }

  async createUser(insertUser: any): Promise<User> {
    try {
      const result = await db.insert(users).values({
        ...insertUser,
        updatedAt: new Date(),
      });
      
      // For MySQL2, the insertId is in the result
      const insertId = (result as any).insertId;
      if (!insertId) {
        throw new Error('Failed to create user');
      }
      
      // Fetch the created user
      const newUser = await this.getUser(Number(insertId));
      if (!newUser) {
        throw new Error('Failed to fetch created user');
      }
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, userUpdate: any): Promise<User | undefined> {
    try {
      await db.update(users)
        .set({
          ...userUpdate,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));
      
      // Fetch the updated user
      return await this.getUser(id);
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  async getAllUsers(): Promise<User[]> {
    const fallback = getStorageInstance();
    if (fallback) return fallback.getAllUsers();
    
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (isQuotaError(error)) {
        useFallbackStorage = true;
        const fallback = getStorageInstance();
        if (fallback) return fallback.getAllUsers();
      }
      return [];
    }
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    try {
      const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching property:', error);
      return undefined;
    }
  }

  async getApprovedProperty(id: number): Promise<Property | undefined> {
    try {
      const result = await db.select().from(properties)
        .where(and(eq(properties.id, id), eq(properties.status, "approved")))
        .limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching approved property:', error);
      return undefined;
    }
  }

  async getAllProperties(): Promise<Property[]> {
    try {
      return await db.select().from(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  }

  async getApprovedProperties(): Promise<Property[]> {
    const fallback = getStorageInstance();
    if (fallback) return fallback.getApprovedProperties();
    
    try {
      return await db.select().from(properties).where(eq(properties.status, "approved"));
    } catch (error) {
      console.error('Error fetching approved properties:', error);
      if (isQuotaError(error)) {
        useFallbackStorage = true;
        const fallback = getStorageInstance();
        if (fallback) return fallback.getApprovedProperties();
      }
      return [];
    }
  }

  async getPropertiesByOwner(ownerId: number): Promise<Property[]> {
    try {
      return await db.select().from(properties).where(eq(properties.ownerId, ownerId));
    } catch (error) {
      console.error('Error fetching properties by owner:', error);
      return [];
    }
  }

  async createProperty(insertProperty: any): Promise<Property> {
    try {
      const result = await db.insert(properties).values({
        ...insertProperty,
        updatedAt: new Date(),
      });
      
      // For MySQL2, the insertId is in the result
      const insertId = (result as any).insertId;
      if (!insertId) {
        throw new Error('Failed to create property');
      }
      
      // Fetch the created property
      const newProperty = await this.getProperty(Number(insertId));
      if (!newProperty) {
        throw new Error('Failed to fetch created property');
      }
      return newProperty;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async updateProperty(id: number, propertyUpdate: any): Promise<Property | undefined> {
    try {
      await db.update(properties)
        .set({
          ...propertyUpdate,
          updatedAt: new Date(),
        })
        .where(eq(properties.id, id));
      
      // Fetch the updated property
      return await this.getProperty(id);
    } catch (error) {
      console.error('Error updating property:', error);
      return undefined;
    }
  }

  async deleteProperty(id: number): Promise<boolean> {
    try {
      const result = await db.delete(properties).where(eq(properties.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    try {
      const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return undefined;
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    const fallback = getStorageInstance();
    if (fallback) return fallback.getAllBookings();
    
    try {
      return await db.select().from(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (isQuotaError(error)) {
        useFallbackStorage = true;
        const fallback = getStorageInstance();
        if (fallback) return fallback.getAllBookings();
      }
      return [];
    }
  }

  async getBookingsByProperty(propertyId: number): Promise<Booking[]> {
    try {
      return await db.select().from(bookings).where(eq(bookings.propertyId, propertyId));
    } catch (error) {
      console.error('Error fetching bookings by property:', error);
      return [];
    }
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    try {
      return await db.select().from(bookings).where(eq(bookings.userId, userId));
    } catch (error) {
      console.error('Error fetching bookings by user:', error);
      return [];
    }
  }

  async getUserBookingForProperty(userId: number, propertyId: number): Promise<Booking | undefined> {
    try {
      const result = await db.select().from(bookings)
        .where(and(
          eq(bookings.userId, userId),
          eq(bookings.propertyId, propertyId),
          ne(bookings.status, 'cancelled')
        ))
        .limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching user booking for property:', error);
      return undefined;
    }
  }

  async getBookedDatesForProperty(propertyId: number): Promise<{ checkIn: Date, checkOut: Date }[]> {
    try {
      const result = await db.select({
        checkIn: bookings.checkIn,
        checkOut: bookings.checkOut
      }).from(bookings)
        .where(and(
          eq(bookings.propertyId, propertyId),
          ne(bookings.status, 'cancelled'),
          gte(bookings.checkOut, new Date()) // Only future or current bookings
        ))
        .orderBy(bookings.checkIn);
      
      return result.map(booking => ({
        checkIn: new Date(booking.checkIn),
        checkOut: new Date(booking.checkOut)
      }));
    } catch (error) {
      console.error('Error fetching booked dates for property:', error);
      return [];
    }
  }

  async checkBookingAvailability(propertyId: number, checkIn: Date, checkOut: Date, excludeBookingId?: number): Promise<boolean> {
    try {
      const conditions = [
        eq(bookings.propertyId, propertyId),
        ne(bookings.status, 'cancelled'),
        // Check for overlapping dates
        or(
          // New booking starts during existing booking
          and(
            lte(bookings.checkIn, checkIn),
            gte(bookings.checkOut, checkIn)
          ),
          // New booking ends during existing booking
          and(
            lte(bookings.checkIn, checkOut),
            gte(bookings.checkOut, checkOut)
          ),
          // New booking completely contains existing booking
          and(
            gte(bookings.checkIn, checkIn),
            lte(bookings.checkOut, checkOut)
          )
        )
      ];

      // Exclude specific booking if updating
      if (excludeBookingId) {
        conditions.push(ne(bookings.id, excludeBookingId));
      }

      const overlappingBookings = await db.select().from(bookings)
        .where(and(...conditions))
        .limit(1);

      return overlappingBookings.length === 0;
    } catch (error) {
      console.error('Error checking booking availability:', error);
      return false;
    }
  }

  async createBooking(insertBooking: any): Promise<Booking> {
    try {
      console.log('Storage: Creating booking with data:', insertBooking);
      
      // Validate required fields
      if (!insertBooking.propertyId) {
        throw new Error('Property ID is required');
      }
      if (!insertBooking.guestName) {
        throw new Error('Guest name is required');
      }
      if (!insertBooking.guestEmail) {
        throw new Error('Guest email is required');
      }
      if (!insertBooking.checkIn || !insertBooking.checkOut) {
        throw new Error('Check-in and check-out dates are required');
      }
      
      // Ensure dates are Date objects
      const checkInDate = insertBooking.checkIn instanceof Date ? 
        insertBooking.checkIn : new Date(insertBooking.checkIn);
      const checkOutDate = insertBooking.checkOut instanceof Date ? 
        insertBooking.checkOut : new Date(insertBooking.checkOut);

      // Validate dates
      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        throw new Error('Invalid check-in or check-out date format');
      }

      if (checkInDate >= checkOutDate) {
        throw new Error('Check-out date must be after check-in date');
      }
      
      // Check availability first (skip for blocked dates)
      if (insertBooking.status !== 'blocked') {
        console.log('Storage: Checking availability...');
        const isAvailable = await this.checkBookingAvailability(
          insertBooking.propertyId,
          checkInDate,
          checkOutDate
        );

        if (!isAvailable) {
          throw new Error('Property is not available for the selected dates');
        }
        console.log('Storage: Availability check passed');
      }

      const bookingToInsert = {
        ...insertBooking,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Storage: Inserting booking into MySQL database:', bookingToInsert);

      const result = await db.insert(bookings).values(bookingToInsert);
      
      // Get the inserted ID
      const insertId = (result as any).insertId;
      if (!insertId) {
        throw new Error('Failed to create booking in database');
      }

      // Fetch the created booking
      const newBooking = await this.getBooking(Number(insertId));
      if (!newBooking) {
        throw new Error('Failed to fetch created booking');
      }

      console.log('Storage: ✅ Booking successfully saved to MySQL database:', {
        id: newBooking.id,
        guestName: newBooking.guestName,
        propertyId: newBooking.propertyId,
        status: newBooking.status
      });

      return newBooking;
    } catch (error) {
      console.error('Storage: Error creating booking:', error);
      throw error;
    }
  }

  async updateBooking(id: number, bookingUpdate: any): Promise<Booking | undefined> {
    try {
      // If updating dates, check availability
      if (bookingUpdate.checkIn || bookingUpdate.checkOut) {
        const existingBooking = await this.getBooking(id);
        if (!existingBooking) {
          throw new Error('Booking not found');
        }

        const checkIn = bookingUpdate.checkIn ? new Date(bookingUpdate.checkIn) : existingBooking.checkIn;
        const checkOut = bookingUpdate.checkOut ? new Date(bookingUpdate.checkOut) : existingBooking.checkOut;

        const isAvailable = await this.checkBookingAvailability(
          existingBooking.propertyId,
          checkIn,
          checkOut,
          id // Exclude current booking from availability check
        );

        if (!isAvailable) {
          throw new Error('Property is not available for the selected dates');
        }
      }

      await db.update(bookings)
        .set({
          ...bookingUpdate,
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, id));
      
      // Fetch the updated booking
      return await this.getBooking(id);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async createOrUpdateBooking(bookingData: any): Promise<Booking> {
    try {
      // If userId is provided, check if user already has a booking for this property
      if (bookingData.userId) {
        const existingBooking = await this.getUserBookingForProperty(
          bookingData.userId,
          bookingData.propertyId
        );

        if (existingBooking) {
          // Update existing booking
          const updatedBooking = await this.updateBooking(existingBooking.id, bookingData);
          if (!updatedBooking) {
            throw new Error('Failed to update existing booking');
          }
          return updatedBooking;
        }
      }

      // Create new booking
      return await this.createBooking(bookingData);
    } catch (error) {
      console.error('Error creating or updating booking:', error);
      throw error;
    }
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    try {
      const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching message:', error);
      return undefined;
    }
  }

  async getAllMessages(): Promise<Message[]> {
    const fallback = getStorageInstance();
    if (fallback) return fallback.getAllMessages();
    
    try {
      return await db.select().from(messages).orderBy(messages.createdAt);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (isQuotaError(error)) {
        useFallbackStorage = true;
        const fallback = getStorageInstance();
        if (fallback) return fallback.getAllMessages();
      }
      return [];
    }
  }

  async createMessage(insertMessage: any): Promise<Message> {
    try {
      const result = await db.insert(messages).values({
        ...insertMessage,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Fetch the created message using insertId
      const [newMessage] = await db.select().from(messages)
        .where(eq(messages.id, (result as any).insertId));
      
      if (!newMessage) {
        throw new Error('Failed to create message');
      }
      return newMessage;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async updateMessage(id: number, messageUpdate: any): Promise<Message | undefined> {
    try {
      await db.update(messages)
        .set({
          ...messageUpdate,
          updatedAt: new Date(),
        })
        .where(eq(messages.id, id));
      
      // Fetch the updated message
      const [updatedMessage] = await db.select().from(messages)
        .where(eq(messages.id, id));
      
      return updatedMessage || undefined;
    } catch (error) {
      console.error('Error updating message:', error);
      return undefined;
    }
  }

  async deleteMessage(id: number): Promise<boolean> {
    try {
      const result = await db.delete(messages).where(eq(messages.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  // Audit Log methods
  async createAuditLog(auditLog: any): Promise<AuditLog> {
    try {
      const result = await db.insert(auditLogs).values({
        ...auditLog,
        createdAt: new Date(),
      });
      
      // Fetch the created audit log using insertId
      const [newAuditLog] = await db.select().from(auditLogs)
        .where(eq(auditLogs.id, (result as any).insertId));
      
      if (!newAuditLog) {
        throw new Error('Failed to create audit log');
      }
      return newAuditLog;
    } catch (error) {
      console.error('Error creating audit log:', error);
      throw error;
    }
  }

  async getAuditLogs(filters?: {
    userId?: number;
    action?: string;
    entity?: string;
    severity?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    try {
      const whereConditions: any[] = [];
      const limit = filters?.limit ?? 100;
      const offset = filters?.offset ?? 0;
      
      if (filters?.userId) {
        whereConditions.push(eq(auditLogs.userId, filters.userId));
      }
      if (filters?.action) {
        whereConditions.push(eq(auditLogs.action, filters.action));
      }
      if (filters?.entity) {
        whereConditions.push(eq(auditLogs.entity, filters.entity));
      }
      if (filters?.severity) {
        whereConditions.push(eq(auditLogs.severity, filters.severity));
      }
      if (filters?.startDate) {
        whereConditions.push(gte(auditLogs.createdAt, filters.startDate));
      }
      if (filters?.endDate) {
        whereConditions.push(lte(auditLogs.createdAt, filters.endDate));
      }

      // Build query based on whether we have filters
      const baseQuery = db.select({
        id: auditLogs.id,
        userId: auditLogs.userId,
        action: auditLogs.action,
        entity: auditLogs.entity,
        entityId: auditLogs.entityId,
        oldValues: auditLogs.oldValues,
        newValues: auditLogs.newValues,
        ipAddress: auditLogs.ipAddress,
        userAgent: auditLogs.userAgent,
        severity: auditLogs.severity,
        description: auditLogs.description,
        createdAt: auditLogs.createdAt,
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
          role: users.role,
        }
      }).from(auditLogs).leftJoin(users, eq(auditLogs.userId, users.id));

      let result;
      if (whereConditions.length > 0) {
        result = await baseQuery
          .where(and(...whereConditions))
          .orderBy(desc(auditLogs.createdAt))
          .limit(limit)
          .offset(offset);
      } else {
        result = await baseQuery
          .orderBy(desc(auditLogs.createdAt))
          .limit(limit)
          .offset(offset);
      }

      return result as AuditLog[];
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  }

  async getAuditLogsByUser(userId: number): Promise<AuditLog[]> {
    try {
      return await db.select().from(auditLogs).where(eq(auditLogs.userId, userId)).orderBy(desc(auditLogs.createdAt));
    } catch (error) {
      console.error('Error fetching audit logs by user:', error);
      return [];
    }
  }

  async getRecentAuditLogs(limit?: number): Promise<AuditLog[]> {
    try {
      return await db.select({
        id: auditLogs.id,
        userId: auditLogs.userId,
        action: auditLogs.action,
        entity: auditLogs.entity,
        entityId: auditLogs.entityId,
        oldValues: auditLogs.oldValues,
        newValues: auditLogs.newValues,
        ipAddress: auditLogs.ipAddress,
        userAgent: auditLogs.userAgent,
        severity: auditLogs.severity,
        description: auditLogs.description,
        createdAt: auditLogs.createdAt,
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
          role: users.role,
        }
      }).from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit || 50);
    } catch (error) {
      console.error('Error fetching recent audit logs:', error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();