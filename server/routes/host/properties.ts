// Host Property Submission Handler
import { db } from '../../db';
import { properties, notifications, users } from '../../../shared/schema';
import { eq } from 'drizzle-orm';
import { notificationService } from '../../services/notificationService';
import type { Request, Response } from 'express';

// Extend Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export async function submitProperty(req: AuthenticatedRequest, res: Response) {
  try {
    const hostId = req.user?.id;
    
    if (!hostId) {
      return res.status(401).json({ error: 'Host authentication required' });
    }

    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      capacity,
      location,
      amenities,
      images,
      rules
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, price, location' 
      });
    }

    console.log(`Host ${hostId} submitting property: ${title}`);

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // 1. Create property with pending status
      const propertyData = {
        title: title.trim(),
        description: description.trim(),
        price: String(parseFloat(price)),
        bedrooms: parseInt(bedrooms) || 1,
        bathrooms: parseInt(bathrooms) || 1,
        capacity: parseInt(capacity) || 1,
        location: location.trim(),
        amenities: Array.isArray(amenities) ? amenities : [],
        images: Array.isArray(images) ? images : [],
        rules: rules || '',
        hostId: hostId,
        ownerId: hostId, // For backward compatibility
        status: 'pending' as const,
        isActive: false,
        isVisible: false
      };

      const [newProperty] = await tx.insert(properties)
        .values(propertyData)
        .returning();

      if (!newProperty) {
        throw new Error('Failed to create property');
      }

      // 2. Get host details
      const [hostDetails] = await tx.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
      })
      .from(users)
      .where(eq(users.id, hostId));

      if (!hostDetails) {
        throw new Error('Host not found');
      }

      // 3. Get all admin users
      const adminUsers = await tx.select({
        id: users.id,
        name: users.name,
        email: users.email
      })
      .from(users)
      .where(eq(users.role, 'admin'));

      // 4. Create notifications for all admins
      if (adminUsers.length > 0) {
        const adminNotifications = adminUsers.map(admin => ({
          userId: admin.id,
          type: 'property_review',
          title: 'New Property Pending Review',
          message: `Property "${title}" submitted by ${hostDetails.name} requires review`,
          propertyId: newProperty.id,
          isRead: false
        }));

        await tx.insert(notifications).values(adminNotifications);
      }

      // 5. Create confirmation notification for host
      await tx.insert(notifications).values({
        userId: hostId,
        type: 'property_submitted',
        title: 'Property Submitted Successfully',
        message: `Your property "${title}" has been submitted for review. You'll be notified once it's approved.`,
        propertyId: newProperty.id,
        isRead: false
      });

      return {
        success: true,
        message: 'Property submitted successfully for review',
        property: {
          id: newProperty.id,
          title: newProperty.title,
          status: newProperty.status,
          createdAt: newProperty.createdAt
        },
        host: hostDetails,
        adminUsers
      };
    });

    // 6. Send real-time notifications (after transaction)
    setTimeout(async () => {
      try {
        // Notify admins
        if (result.adminUsers.length > 0) {
          await notificationService.sendToAdmins({
            type: 'PROPERTY_REVIEW_REQUEST',
            propertyId: result.property.id,
            title: title,
            hostName: result.host.name,
            hostId: hostId,
            message: `New property "${title}" needs review`,
            timestamp: new Date().toISOString()
          });
        }

        // Confirm to host
        await notificationService.sendToHost(hostId, {
          type: 'PROPERTY_SUBMITTED',
          propertyId: result.property.id,
          title: title,
          message: 'Property submitted successfully and is pending review',
          timestamp: new Date().toISOString()
        });
      } catch (wsError) {
        console.error('WebSocket notification failed:', wsError);
      }
    }, 100);

    res.status(201).json(result);

  } catch (error) {
    console.error('Error submitting property:', error);
    res.status(500).json({ 
      error: (error as Error).message || 'Failed to submit property' 
    });
  }
}

// Get host's properties
export async function getHostProperties(req: AuthenticatedRequest, res: Response) {
  try {
    const hostId = req.user?.id;
    
    if (!hostId) {
      return res.status(401).json({ error: 'Host authentication required' });
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(String(page));
    const limitNum = parseInt(String(limit));
    const offset = (pageNum - 1) * limitNum;

    const hostProperties = await db.select({
      id: properties.id,
      title: properties.title,
      description: properties.description,
      price: properties.price,
      status: properties.status,
      images: properties.images,
      bedrooms: properties.bedrooms,
      bathrooms: properties.bathrooms,
      location: properties.location,
      isActive: properties.isActive,
      isVisible: properties.isVisible,
      createdAt: properties.createdAt,
      updatedAt: properties.updatedAt,
      reviewedAt: properties.reviewedAt,
      approvedAt: properties.approvedAt,
      rejectionReason: properties.rejectionReason
    })
    .from(properties)
    .where(eq(properties.hostId, hostId))
    .orderBy(properties.createdAt)
    .limit(limitNum)
    .offset(offset);

    // Get total count
    const totalResult = await db.select({ count: properties.id })
      .from(properties)
      .where(eq(properties.hostId, hostId));

    const total = totalResult.length;

    res.json({
      success: true,
      properties: hostProperties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching host properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
}
