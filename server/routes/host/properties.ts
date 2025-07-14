
import { Router } from 'express';
import { db } from '../../db.js';
import { properties } from '../../../shared/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get properties for specific owner
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const ownerId = parseInt(req.params.ownerId);
    
    const hostProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, ownerId));

    res.json(hostProperties);
  } catch (error) {
    console.error('Error fetching host properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Create new property (always pending for hosts)
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const propertyData = {
      ...req.body,
      ownerId: parseInt(userId as string),
      status: userRole === 'admin' ? 'approved' : 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [newProperty] = await db
      .insert(properties)
      .values(propertyData)
      .returning();

    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property (keeps pending status unless admin)
router.put('/:id', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    
    // Check ownership unless admin
    if (userRole !== 'admin') {
      const existingProperty = await db
        .select()
        .from(properties)
        .where(eq(properties.id, propertyId))
        .limit(1);
      
      if (!existingProperty.length || existingProperty[0].ownerId !== parseInt(userId as string)) {
        return res.status(403).json({ error: 'Not authorized to update this property' });
      }
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Set status to pending if host is editing (unless admin)
    if (userRole !== 'admin') {
      updateData.status = 'pending';
    }

    const [updatedProperty] = await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, propertyId))
      .returning();

    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

export default router;
