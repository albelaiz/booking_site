import mongoose from 'mongoose';
import { mongoStorage } from '../storage/mongoStorage';

// Helper to convert string IDs to ObjectIds when needed
export const createObjectId = (id: string | number): mongoose.Types.ObjectId => {
  if (typeof id === 'number') {
    // For legacy numeric IDs, we'll create a deterministic ObjectId
    // This is a temporary solution during migration
    const paddedId = id.toString().padStart(24, '0');
    return new mongoose.Types.ObjectId(paddedId);
  }
  return new mongoose.Types.ObjectId(id);
};

// Helper to ensure string ID format
export const toStringId = (id: string | number | mongoose.Types.ObjectId): string => {
  if (typeof id === 'number') {
    return id.toString().padStart(24, '0');
  }
  return id.toString();
};

// Updated MongoDB storage with ID conversion helpers
export class MongoStorageAdapter {
  private storage = mongoStorage;

  // User methods with ID conversion
  async getUserById(id: string | number) {
    return await this.storage.getUserById(toStringId(id));
  }

  async getUser(id: string | number) {
    return await this.storage.getUserById(toStringId(id));
  }

  async updateUser(id: string | number, updates: any) {
    return await this.storage.updateUser(toStringId(id), updates);
  }

  async deleteUser(id: string | number) {
    return await this.storage.deleteUser(toStringId(id));
  }

  // Property methods with ID conversion
  async getProperty(id: string | number) {
    return await this.storage.getPropertyById(toStringId(id));
  }

  async getPropertyById(id: string | number) {
    return await this.storage.getPropertyById(toStringId(id));
  }

  async updateProperty(id: string | number, updates: any) {
    return await this.storage.updateProperty(toStringId(id), updates);
  }

  async deleteProperty(id: string | number) {
    return await this.storage.deleteProperty(toStringId(id));
  }

  async getPropertiesByOwner(ownerId: string | number) {
    return await this.storage.getPropertiesByOwner(toStringId(ownerId));
  }

  async createProperty(propertyData: any) {
    // Convert ID fields to ObjectIds
    const mongoData = {
      ...propertyData,
      ownerId: propertyData.ownerId ? createObjectId(propertyData.ownerId) : undefined,
      hostId: propertyData.hostId ? createObjectId(propertyData.hostId) : undefined,
    };
    return await this.storage.createProperty(mongoData);
  }

  // Booking methods with ID conversion
  async getBooking(id: string | number) {
    return await this.storage.getBookingById(toStringId(id));
  }

  async updateBooking(id: string | number, updates: any) {
    return await this.storage.updateBooking(toStringId(id), updates);
  }

  async createOrUpdateBooking(bookingData: any) {
    // Convert ID fields to ObjectIds
    const mongoData = {
      ...bookingData,
      propertyId: bookingData.propertyId ? createObjectId(bookingData.propertyId) : undefined,
      userId: bookingData.userId ? createObjectId(bookingData.userId) : undefined,
    };
    return await this.storage.createBooking(mongoData);
  }

  // Message methods
  async getMessage(id: string | number) {
    return await this.storage.getMessageById(toStringId(id));
  }

  // Notification methods
  async getUserNotifications(userId: string | number, limit?: number) {
    const notifications = await this.storage.getNotificationsByUser(toStringId(userId));
    return limit ? notifications.slice(0, limit) : notifications;
  }

  async markNotificationAsRead(id: string | number, userId?: string | number) {
    return await this.storage.markNotificationAsRead(toStringId(id));
  }

  // Forward all other methods directly
  async getUserByUsername(username: string) { return await this.storage.getUserByUsername(username); }
  async getUserByEmail(email: string) { return await this.storage.getUserByEmail(email); }
  async getUsersByRole(role: string) { return await this.storage.getUsersByRole(role); }
  async getAllUsers() { return await this.storage.getAllUsers(); }
  async createUser(userData: any) { return await this.storage.createUser(userData); }
  
  async getAllProperties() { return await this.storage.getAllProperties(); }
  async getPublicProperties() { return await this.storage.getPublicProperties(); }
  async getPendingProperties() { return await this.storage.getPendingProperties(); }
  async getPropertiesByStatus(status: string) { return await this.storage.getPropertiesByStatus(status); }
  async getPropertiesByHost(hostId: string | number) { return await this.storage.getPropertiesByHost(toStringId(hostId)); }
  async approveProperty(id: string | number, reviewedBy: string | number) { 
    return await this.storage.approveProperty(toStringId(id), toStringId(reviewedBy)); 
  }
  async rejectProperty(id: string | number, reason: string, reviewedBy: string | number) { 
    return await this.storage.rejectProperty(toStringId(id), reason, toStringId(reviewedBy)); 
  }
  
  async getAllBookings() { return await this.storage.getAllBookings(); }
  async getBookingsByUser(userId: string | number) { return await this.storage.getBookingsByUser(toStringId(userId)); }
  async getBookingsByProperty(propertyId: string | number) { return await this.storage.getBookingsByProperty(toStringId(propertyId)); }
  async createBooking(bookingData: any) { 
    const mongoData = {
      ...bookingData,
      propertyId: bookingData.propertyId ? createObjectId(bookingData.propertyId) : undefined,
      userId: bookingData.userId ? createObjectId(bookingData.userId) : undefined,
    };
    return await this.storage.createBooking(mongoData);
  }
  
  async getAllMessages() { return await this.storage.getAllMessages(); }
  async createMessage(messageData: any) { return await this.storage.createMessage(messageData); }
  async updateMessage(id: string | number, updates: any) { return await this.storage.updateMessage(toStringId(id), updates); }
  async deleteMessage(id: string | number) { return await this.storage.deleteMessage(toStringId(id)); }
  
  async createNotification(notificationData: any) { 
    const mongoData = {
      ...notificationData,
      userId: notificationData.userId ? createObjectId(notificationData.userId) : undefined,
      propertyId: notificationData.propertyId ? createObjectId(notificationData.propertyId) : undefined,
      bookingId: notificationData.bookingId ? createObjectId(notificationData.bookingId) : undefined,
    };
    return await this.storage.createNotification(mongoData); 
  }
  async deleteNotification(id: string | number) { return await this.storage.deleteNotification(toStringId(id)); }

  // Database seeding
  async seedDatabase() { return await this.storage.seedDatabase(); }

  // Booking availability methods
  async checkBookingAvailability(propertyId: string | number, checkIn: Date, checkOut: Date): Promise<boolean> {
    const mongoId = typeof propertyId === 'number' ? createObjectId(propertyId).toString() : propertyId;
    return this.storage.checkBookingAvailability(mongoId, checkIn, checkOut);
  }

  async getBookedDatesForProperty(propertyId: string | number): Promise<{ checkIn: Date, checkOut: Date }[]> {
    const mongoId = typeof propertyId === 'number' ? createObjectId(propertyId).toString() : propertyId;
    return this.storage.getBookedDatesForProperty(mongoId);
  }

  // Audit log methods
  async getAuditLogs(filters: any): Promise<any[]> {
    return this.storage.getAuditLogs(filters);
  }

  async getRecentAuditLogs(limit: number): Promise<any[]> {
    return this.storage.getRecentAuditLogs(limit);
  }

  async getAuditLogsByUser(userId: string | number): Promise<any[]> {
    const mongoId = typeof userId === 'number' ? createObjectId(userId).toString() : userId;
    return this.storage.getAuditLogsByUser(mongoId);
  }

  async createAuditLog(auditLogData: any): Promise<any> {
    return this.storage.createAuditLog(auditLogData);
  }
}

export const mongoStorageAdapter = new MongoStorageAdapter();
