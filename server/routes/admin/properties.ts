
import { Router } from 'express';
import { db } from '../../db.js';
import { properties } from '../../../shared/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all properties for admin (regardless of status)
router.get('/', async (req, res) => {
  try {
    const allProperties = await db.select().from(properties);
    res.json(allProperties);
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Approve property
router.patch('/:id/approve', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    const [updatedProperty] = await db
      .update(properties)
      .set({ 
        status: 'approved',
        updatedAt: new Date()
      })
      .where(eq(properties.id, propertyId))
      .returning();

    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(updatedProperty);
  } catch (error) {
    console.error('Error approving property:', error);
    res.status(500).json({ error: 'Failed to approve property' });
  }
});

// Reject property
router.patch('/:id/reject', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    const [updatedProperty] = await db
      .update(properties)
      .set({ 
        status: 'rejected',
        updatedAt: new Date()
      })
      .where(eq(properties.id, propertyId))
      .returning();

    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(updatedProperty);
  } catch (error) {
    console.error('Error rejecting property:', error);
    res.status(500).json({ error: 'Failed to reject property' });
  }
});

export default router;
