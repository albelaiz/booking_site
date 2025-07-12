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
    const hostId = req.user?.id || parseInt(req.headers['x-user-id'] as string);
    const authHeader = req.headers.authorization;
    
    console.log('Property submission request:', {
      hostId,
      hasAuth: !!authHeader,
      bodyKeys: Object.keys(req.body)
    });
    
    if (!hostId) {
      console.log('Missing host ID for property submission');
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

    // Create property with pending status (no transaction needed for Neon HTTP)
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
      isVisible: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [newProperty] = await db.insert(properties)
      .values(propertyData)
      .returning();

    if (!newProperty) {
      throw new Error('Failed to create property');
    }

    // Get host details
    const [hostDetails] = await db.select({
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

    // Get all admin users
    const adminUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email
    })
    .from(users)
    .where(eq(users.role, 'admin'));

    // Create notifications for all admins
    if (adminUsers.length > 0) {
      const adminNotifications = adminUsers.map(admin => ({
        userId: admin.id,
        type: 'property_review' as const,
        title: 'New Property Pending Review',
        message: `Property "${title}" submitted by ${hostDetails.name} requires review`,
        propertyId: newProperty.id,
        isRead: false
      }));

      await db.insert(notifications).values(adminNotifications);
    }

    // Create confirmation notification for host
    await db.insert(notifications).values({
      userId: hostId,
      type: 'property_submitted' as const,
      title: 'Property Submitted Successfully',
      message: `Your property "${title}" has been submitted for review. You'll be notified once it's approved.`,
      propertyId: newProperty.id,
      isRead: false
    });

    const result = {
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

    // Send real-time notifications (after main operations)
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
    const hostId = req.user?.id || parseInt(req.headers['x-user-id'] as string);
    const authHeader = req.headers.authorization;
    
    console.log('Host properties request:', {
      hostId,
      hasAuth: !!authHeader,
      userAgent: req.headers['user-agent']
    });
    
    if (!hostId) {
      console.log('Missing host ID in request');
      return res.status(401).json({ error: 'Host authentication required' });
    }

    const { page = 1, limit = 100 } = req.query;
    const pageNum = parseInt(String(page));
    const limitNum = parseInt(String(limit));
    const offset = (pageNum - 1) * limitNum;

    console.log(`Fetching properties for hostId: ${hostId}`);

    const hostProperties = await db.select({
      id: properties.id,
      title: properties.title,
      description: properties.description,
      price: properties.price,
      status: properties.status,
      images: properties.images,
      bedrooms: properties.bedrooms,
      bathrooms: properties.bathrooms,
      capacity: properties.capacity,
      location: properties.location,
      amenities: properties.amenities,
      isActive: properties.isActive,
      isVisible: properties.isVisible,
      hostId: properties.hostId,
      ownerId: properties.ownerId,
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

    console.log(`Found ${hostProperties.length} properties for host ${hostId}`);

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
