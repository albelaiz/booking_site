import type { User, Property, Booking, Message, AuditLog } from "@shared/schema";
import { mockUsers, mockProperties, mockBookings, mockMessages, mockAuditLogs } from "./mockData.js";

export class FallbackStorage {
  private users: User[] = [...mockUsers];
  private properties: Property[] = [...mockProperties];
  private bookings: Booking[] = [...mockBookings];
  private messages: Message[] = [...mockMessages];
  private auditLogs: AuditLog[] = [...mockAuditLogs];
  
  private nextUserId = Math.max(...this.users.map(u => u.id), 0) + 1;
  private nextPropertyId = Math.max(...this.properties.map(p => p.id), 0) + 1;
  private nextBookingId = Math.max(...this.bookings.map(b => b.id), 0) + 1;
  private nextMessageId = Math.max(...this.messages.map(m => m.id), 0) + 1;
  private nextAuditLogId = Math.max(...this.auditLogs.map(a => a.id), 0) + 1;

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async createUser(user: any): Promise<User> {
    const newUser: User = {
      id: this.nextUserId++,
      username: user.username,
      password: user.password,
      email: user.email || null,
      name: user.name,
      role: user.role || "user",
      status: user.status || "active",
      phone: user.phone || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, userData: any): Promise<User | undefined> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;
    
    const updatedUser = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date(),
    };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return this.users.length < initialLength;
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.find(property => property.id === id);
  }

  async getApprovedProperty(id: number): Promise<Property | undefined> {
    return this.properties.find(property => property.id === id && property.status === "approved");
  }

  async getAllProperties(): Promise<Property[]> {
    return [...this.properties];
  }

  async getApprovedProperties(): Promise<Property[]> {
    return this.properties.filter(property => property.status === "approved");
  }

  async getPropertiesByOwner(ownerId: number): Promise<Property[]> {
    return this.properties.filter(property => property.ownerId === ownerId);
  }

  async createProperty(property: any): Promise<Property> {
    const newProperty: Property = {
      id: this.nextPropertyId++,
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      priceUnit: property.priceUnit || "night",
      images: property.images || [],
      location: property.location,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      capacity: property.capacity,
      amenities: property.amenities || [],
      featured: property.featured || false,
      rating: property.rating || "0",
      reviewCount: property.reviewCount || 0,
      ownerId: property.ownerId,
      status: property.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.properties.push(newProperty);
    return newProperty;
  }

  async updateProperty(id: number, propertyData: any): Promise<Property | undefined> {
    const propertyIndex = this.properties.findIndex(property => property.id === id);
    if (propertyIndex === -1) return undefined;
    
    const updatedProperty = {
      ...this.properties[propertyIndex],
      ...propertyData,
      updatedAt: new Date(),
    };
    this.properties[propertyIndex] = updatedProperty;
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const initialLength = this.properties.length;
    this.properties = this.properties.filter(property => property.id !== id);
    return this.properties.length < initialLength;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.find(booking => booking.id === id);
  }

  async getAllBookings(): Promise<Booking[]> {
    return [...this.bookings];
  }

  async getBookingsByProperty(propertyId: number): Promise<Booking[]> {
    return this.bookings.filter(booking => booking.propertyId === propertyId);
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return this.bookings.filter(booking => booking.userId === userId);
  }

  async getUserBookingForProperty(userId: number, propertyId: number): Promise<Booking | undefined> {
    return this.bookings.find(booking => 
      booking.userId === userId && booking.propertyId === propertyId
    );
  }

  async getBookedDatesForProperty(propertyId: number): Promise<{ checkIn: Date, checkOut: Date }[]> {
    return this.bookings
      .filter(booking => booking.propertyId === propertyId && booking.status !== "cancelled")
      .map(booking => ({
        checkIn: booking.checkIn,
        checkOut: booking.checkOut
      }));
  }

  async checkBookingAvailability(
    propertyId: number, 
    checkIn: Date, 
    checkOut: Date, 
    excludeBookingId?: number
  ): Promise<boolean> {
    const conflictingBookings = this.bookings.filter(booking =>
      booking.propertyId === propertyId &&
      booking.status !== "cancelled" &&
      (excludeBookingId ? booking.id !== excludeBookingId : true) &&
      ((checkIn >= booking.checkIn && checkIn < booking.checkOut) ||
       (checkOut > booking.checkIn && checkOut <= booking.checkOut) ||
       (checkIn <= booking.checkIn && checkOut >= booking.checkOut))
    );
    return conflictingBookings.length === 0;
  }

  async createBooking(booking: any): Promise<Booking> {
    const newBooking: Booking = {
      id: this.nextBookingId++,
      propertyId: booking.propertyId,
      userId: booking.userId || null,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone || null,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      amount: booking.amount.toString(),
      status: booking.status || "pending",
      comments: booking.comments || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async updateBooking(id: number, bookingData: any): Promise<Booking | undefined> {
    const bookingIndex = this.bookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) return undefined;
    
    const updatedBooking = {
      ...this.bookings[bookingIndex],
      ...bookingData,
      updatedAt: new Date(),
    };
    this.bookings[bookingIndex] = updatedBooking;
    return updatedBooking;
  }

  async createOrUpdateBooking(booking: any): Promise<Booking> {
    if (booking.id) {
      const existing = await this.updateBooking(booking.id, booking);
      if (existing) return existing;
    }
    return this.createBooking(booking);
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.find(message => message.id === id);
  }

  async getAllMessages(): Promise<Message[]> {
    return [...this.messages];
  }

  async createMessage(message: any): Promise<Message> {
    const newMessage: Message = {
      id: this.nextMessageId++,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      status: message.status || "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  async updateMessage(id: number, messageData: any): Promise<Message | undefined> {
    const messageIndex = this.messages.findIndex(message => message.id === id);
    if (messageIndex === -1) return undefined;
    
    const updatedMessage = {
      ...this.messages[messageIndex],
      ...messageData,
      updatedAt: new Date(),
    };
    this.messages[messageIndex] = updatedMessage;
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const initialLength = this.messages.length;
    this.messages = this.messages.filter(message => message.id !== id);
    return this.messages.length < initialLength;
  }

  // Audit Log methods
  async createAuditLog(auditLog: any): Promise<AuditLog> {
    const newAuditLog: AuditLog = {
      id: this.nextAuditLogId++,
      userId: auditLog.userId,
      action: auditLog.action,
      entity: auditLog.entity,
      entityId: auditLog.entityId || null,
      oldValues: auditLog.oldValues || null,
      newValues: auditLog.newValues || null,
      ipAddress: auditLog.ipAddress || null,
      userAgent: auditLog.userAgent || null,
      severity: auditLog.severity || "info",
      description: auditLog.description || null,
      createdAt: new Date(),
    };
    this.auditLogs.push(newAuditLog);
    return newAuditLog;
  }

  async getAuditLogs(filters?: {
    userId?: number;
    action?: string;
    entity?: string;
    entityId?: number;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    let result = [...this.auditLogs];
    
    if (filters?.userId) {
      result = result.filter(log => log.userId === filters.userId);
    }
    if (filters?.action) {
      result = result.filter(log => log.action === filters.action);
    }
    if (filters?.entity) {
      result = result.filter(log => log.entity === filters.entity);
    }
    if (filters?.entityId) {
      result = result.filter(log => log.entityId === filters.entityId);
    }
    
    // Sort by creation date (newest first)
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    if (filters?.offset) {
      result = result.slice(filters.offset);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }
    
    return result;
  }
}
