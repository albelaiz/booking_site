
import { Router } from 'express';
import { db } from '../../db.js';
import { properties } from '../../../shared/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get only approved properties for public viewing
router.get('/public', async (req, res) => {
  try {
    const approvedProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.status, 'approved'));

    res.json(approvedProperties);
  } catch (error) {
    console.error('Error fetching public properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

export default router;
