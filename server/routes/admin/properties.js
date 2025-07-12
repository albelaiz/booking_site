// Admin Property Approval Handler
import { db } from '../db.js';
import { properties, notifications, users } from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { notificationService } from '../services/notificationService.js';

export async function approveProperty(req, res) {
  try {
    const { propertyId } = req.params;
    const { action, rejectionReason = null } = req.body; // 'approve' or 'reject'
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Valid action (approve/reject) is required' });
    }

    console.log(`Admin ${adminId} ${action}ing property ${propertyId}`);

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // 1. Update property status and visibility
      const updateData = {
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewedAt: new Date(),
        reviewedBy: adminId,
        rejectionReason: action === 'reject' ? rejectionReason : null,
        // CRITICAL: Make property visible on home page when approved
        isActive: action === 'approve' ? true : false,
        isVisible: action === 'approve' ? true : false,
        approvedAt: action === 'approve' ? new Date() : null,
        updatedAt: new Date()
      };

      const [updatedProperty] = await tx.update(properties)
        .set(updateData)
        .where(eq(properties.id, parseInt(propertyId)))
        .returning();

      if (!updatedProperty) {
        throw new Error('Property not found');
      }

      // 2. Get property with host details
      const propertyWithHost = await tx.select({
        property: properties,
        host: {
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role
        }
      })
      .from(properties)
      .leftJoin(users, eq(properties.hostId, users.id))
      .where(eq(properties.id, parseInt(propertyId)));

      if (!propertyWithHost.length) {
        throw new Error('Property or host not found');
      }

      const { property, host } = propertyWithHost[0];

      // 3. Create notification for host
      const notificationData = {
        userId: host.id,
        type: action === 'approve' ? 'property_approved' : 'property_rejected',
        title: `Property ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        message: action === 'approve' 
          ? `Congratulations! Your property "${property.title}" has been approved and is now live on the platform.`
          : `Your property "${property.title}" has been rejected. ${rejectionReason ? `Reason: ${rejectionReason}` : 'Please review and resubmit.'}`,
        propertyId: property.id,
        isRead: false
      };

      await tx.insert(notifications).values(notificationData);

      return {
        success: true,
        message: `Property ${action}ed successfully`,
        property: updatedProperty,
        host: host
      };
    });

    // 4. Send real-time notification to host (after transaction)
    setTimeout(async () => {
      try {
        await notificationService.sendToHost(result.host.id, {
          type: action === 'approve' ? 'PROPERTY_APPROVED' : 'PROPERTY_REJECTED',
          propertyId: result.property.id,
          title: result.property.title,
          status: result.property.status,
          message: action === 'approve' 
            ? `Your property "${result.property.title}" is now live!`
            : `Your property "${result.property.title}" was rejected. ${rejectionReason || 'Please review and resubmit.'}`,
          timestamp: new Date().toISOString()
        });
      } catch (wsError) {
        console.error('WebSocket notification failed:', wsError);
      }
    }, 100);

    // 5. If approved, broadcast to all users about new property
    if (action === 'approve') {
      setTimeout(async () => {
        try {
          await notificationService.broadcastToAll({
            type: 'NEW_PROPERTY_AVAILABLE',
            propertyId: result.property.id,
            title: result.property.title,
            message: 'A new property is now available!'
          });
        } catch (broadcastError) {
          console.error('Broadcast notification failed:', broadcastError);
        }
      }, 200);
    }

    res.json(result);

  } catch (error) {
    console.error(`Error ${req.body.action}ing property:`, error);
    res.status(500).json({ 
      error: error.message || 'Failed to process property approval' 
    });
  }
}

// Get properties pending admin review
export async function getPendingProperties(req, res) {
  try {
    const adminId = req.user?.id;
    
    if (!adminId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const pendingProperties = await db.select({
      id: properties.id,
      title: properties.title,
      description: properties.description,
      price: properties.price,
      location: properties.location,
      bedrooms: properties.bedrooms,
      bathrooms: properties.bathrooms,
      images: properties.images,
      status: properties.status,
      createdAt: properties.createdAt,
      host: {
        id: users.id,
        name: users.name,
        email: users.email
      }
    })
    .from(properties)
    .leftJoin(users, eq(properties.hostId, users.id))
    .where(eq(properties.status, 'pending'))
    .orderBy(properties.createdAt)
    .limit(parseInt(limit))
    .offset(offset);

    // Get total count
    const totalResult = await db.select({ count: properties.id })
      .from(properties)
      .where(eq(properties.status, 'pending'));

    const total = totalResult.length;

    res.json({
      success: true,
      properties: pendingProperties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching pending properties:', error);
    res.status(500).json({ error: 'Failed to fetch pending properties' });
  }
}
