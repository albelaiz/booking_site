import { db } from '../db.js';
import { properties, users, Property, User } from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';

export class PropertyAccessService {
  /**
   * Check if a user can access a specific property
   */
  static async canUserAccessProperty(userId: number, propertyId: number, userRole: string): Promise<boolean> {
    try {
      // Admins and staff can access all properties
      if (userRole === 'admin' || userRole === 'staff') {
        return true;
      }

      // Check if user owns the property
      const property = await db.select()
        .from(properties)
        .where(and(
          eq(properties.id, propertyId),
          eq(properties.ownerId, userId)
        ));

      return property.length > 0;
    } catch (error) {
      console.error('Error checking property access:', error);
      return false;
    }
  }

  /**
   * Get properties filtered by user role and permissions
   */
  static async getPropertiesForUser(userId: number, userRole: string): Promise<Property[]> {
    try {
      if (userRole === 'admin' || userRole === 'staff') {
        // Admins can see all properties
        return await db.select()
          .from(properties)
          .orderBy(properties.createdAt);
      }

      // Regular users (hosts) can only see their own properties
      return await db.select()
        .from(properties)
        .where(eq(properties.ownerId, userId))
        .orderBy(properties.createdAt);
    } catch (error) {
      console.error('Error fetching properties for user:', error);
      throw error;
    }
  }

  /**
   * Get properties with owner information, filtered by user permissions
   */
  static async getPropertiesWithOwnerForUser(userId: number, userRole: string) {
    try {
      let query;

      if (userRole === 'admin' || userRole === 'staff') {
        // Admins can see all properties with owner info
        query = db.select({
          property: properties,
          owner: {
            id: users.id,
            name: users.name,
            email: users.email,
            username: users.username,
            role: users.role
          }
        })
        .from(properties)
        .leftJoin(users, eq(properties.ownerId, users.id))
        .orderBy(properties.createdAt);
      } else {
        // Hosts can only see their own properties
        query = db.select({
          property: properties,
          owner: {
            id: users.id,
            name: users.name,
            email: users.email,
            username: users.username,
            role: users.role
          }
        })
        .from(properties)
        .leftJoin(users, eq(properties.ownerId, users.id))
        .where(eq(properties.ownerId, userId))
        .orderBy(properties.createdAt);
      }

      const result = await query;
      
      return result.map(({ property, owner }) => ({
        ...property,
        owner
      }));
    } catch (error) {
      console.error('Error fetching properties with owner for user:', error);
      throw error;
    }
  }

  /**
   * Get pending properties for admin review
   */
  static async getPendingPropertiesForReview(): Promise<any[]> {
    try {
      const result = await db.select({
        property: properties,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
          username: users.username
        }
      })
      .from(properties)
      .leftJoin(users, eq(properties.ownerId, users.id))
      .where(eq(properties.status, 'pending'))
      .orderBy(properties.createdAt);

      return result.map(({ property, owner }) => ({
        id: property.id,
        title: property.title,
        description: property.description,
        location: property.location,
        price: property.price,
        images: property.images || [],
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        capacity: property.capacity,
        amenities: property.amenities || [],
        status: property.status,
        createdAt: property.createdAt,
        hostName: owner?.name || 'Unknown',
        hostEmail: owner?.email || '',
        hostId: owner?.id || 0
      }));
    } catch (error) {
      console.error('Error fetching pending properties:', error);
      throw error;
    }
  }

  /**
   * Check if user can edit a specific property
   */
  static async canUserEditProperty(userId: number, propertyId: number, userRole: string): Promise<boolean> {
    try {
      // Admins can edit any property
      if (userRole === 'admin' || userRole === 'staff') {
        return true;
      }

      // Property owners can edit their own properties
      const property = await db.select()
        .from(properties)
        .where(and(
          eq(properties.id, propertyId),
          eq(properties.ownerId, userId)
        ));

      return property.length > 0;
    } catch (error) {
      console.error('Error checking property edit permission:', error);
      return false;
    }
  }

  /**
   * Check if user can delete a specific property
   */
  static async canUserDeleteProperty(userId: number, propertyId: number, userRole: string): Promise<boolean> {
    try {
      // Only admins can delete properties for now
      if (userRole === 'admin') {
        return true;
      }

      // Property owners can delete their own properties if no active bookings
      if (userRole === 'staff' || userRole === 'user') {
        const property = await db.select()
          .from(properties)
          .where(and(
            eq(properties.id, propertyId),
            eq(properties.ownerId, userId)
          ));

        // TODO: Add check for active bookings
        return property.length > 0;
      }

      return false;
    } catch (error) {
      console.error('Error checking property delete permission:', error);
      return false;
    }
  }
}
