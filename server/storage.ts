import { db } from "./db";
import { users, properties, bookings } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { User, Property, Booking } from "@shared/schema";

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
  getAllProperties(): Promise<Property[]>;
  getPropertiesByOwner(ownerId: number): Promise<Property[]>;
  createProperty(property: any): Promise<Property>;
  updateProperty(id: number, property: any): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  getBookingsByProperty(propertyId: number): Promise<Booking[]>;
  createBooking(booking: any): Promise<Booking>;
  updateBooking(id: number, booking: any): Promise<Booking | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: any): Promise<User> {
    try {
      const result = await db.insert(users).values({
        ...insertUser,
        updatedAt: new Date(),
      }).returning();
      
      if (!result[0]) {
        throw new Error('Failed to create user');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, userUpdate: any): Promise<User | undefined> {
    try {
      const result = await db.update(users)
        .set({
          ...userUpdate,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      
      return result[0] || undefined;
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
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  async getAllProperties(): Promise<Property[]> {
    try {
      return await db.select().from(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
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
      }).returning();
      
      if (!result[0]) {
        throw new Error('Failed to create property');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async updateProperty(id: number, propertyUpdate: any): Promise<Property | undefined> {
    try {
      const result = await db.update(properties)
        .set({
          ...propertyUpdate,
          updatedAt: new Date(),
        })
        .where(eq(properties.id, id))
        .returning();
      
      return result[0] || undefined;
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
    try {
      return await db.select().from(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
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

  async createBooking(insertBooking: any): Promise<Booking> {
    try {
      const result = await db.insert(bookings).values({
        ...insertBooking,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      
      if (!result[0]) {
        throw new Error('Failed to create booking');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async updateBooking(id: number, bookingUpdate: any): Promise<Booking | undefined> {
    try {
      const result = await db.update(bookings)
        .set({
          ...bookingUpdate,
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, id))
        .returning();
      
      return result[0] || undefined;
    } catch (error) {
      console.error('Error updating booking:', error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();