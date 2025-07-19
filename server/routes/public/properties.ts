
import { Router } from 'express';
import { db } from '../../db.js';
import { properties } from '../../../shared/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get only approved properties for public viewing
router.get('/properties/public', async (req, res) => {
  try {
    console.log('🔍 Fetching public properties...');
    const approvedProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.status, 'approved'));

    console.log(`✅ Found ${approvedProperties.length} approved properties`);
    res.json(approvedProperties);
  } catch (error) {
    console.error('❌ Error fetching public properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Also add the route without the extra 'properties' prefix for compatibility
router.get('/public', async (req, res) => {
  try {
    console.log('🔍 Fetching public properties (legacy route)...');
    const approvedProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.status, 'approved'));

    console.log(`✅ Found ${approvedProperties.length} approved properties`);
    res.json(approvedProperties);
  } catch (error) {
    console.error('❌ Error fetching public properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

export default router;
