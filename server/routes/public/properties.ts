// Public Home Page Properties Handler
import { db } from '../../db';
import { properties, users } from '../../../shared/schema';
import { eq, and, desc, sql, or } from 'drizzle-orm';
import type { Request, Response } from 'express';

export async function getHomePageProperties(req: Request, res: Response) {
  try {
    const { page = 1, limit = 12, featured = false } = req.query;
    const pageNum = parseInt(String(page));
    const limitNum = parseInt(String(limit));
    const offset = (pageNum - 1) * limitNum;

    console.log(`Fetching home page properties: page=${page}, limit=${limit}, featured=${featured}`);

    // Query only approved and visible properties
    const homeProperties = await db.select({
      id: properties.id,
      title: properties.title,
      description: properties.description,
      price: properties.price,
      priceUnit: properties.priceUnit,
      images: properties.images,
      location: properties.location,
      bedrooms: properties.bedrooms,
      bathrooms: properties.bathrooms,
      capacity: properties.capacity,
      amenities: properties.amenities,
      featured: properties.featured,
      rating: properties.rating,
      reviewCount: properties.reviewCount,
      createdAt: properties.createdAt,
      approvedAt: properties.approvedAt,
      host: {
        id: users.id,
        name: users.name
      }
    })
    .from(properties)
    .leftJoin(users, eq(properties.hostId, users.id))
    .where(and(
      eq(properties.status, 'approved'),
      eq(properties.isActive, true),
      eq(properties.isVisible, true)
    ))
    .orderBy(
      featured === 'true' 
        ? desc(properties.featured) 
        : desc(properties.approvedAt),
      desc(properties.createdAt)
    )
    .limit(limitNum)
    .offset(offset);

    console.log(`Found ${homeProperties.length} properties for home page`);

    // Get total count for pagination
    const totalQuery = await db.select({ 
      count: sql`count(*)`.mapWith(Number)
    })
    .from(properties)
    .where(and(
      eq(properties.status, 'approved'),
      eq(properties.isActive, true),
      eq(properties.isVisible, true)
    ));

    const total = totalQuery[0]?.count || 0;

    res.json({
      success: true,
      properties: homeProperties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching home page properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
}

// Get all approved properties with search/filter capabilities
export async function getPublicProperties(req: Request, res: Response): Promise<void> {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      location = '',
      minPrice = 0,
      maxPrice = 10000,
      bedrooms = 0,
      bathrooms = 0,
      featured = false 
    } = req.query;

    const pageNum = parseInt(String(page));
    const limitNum = parseInt(String(limit));
    const searchTerm = String(search);
    const locationTerm = String(location);
    const minPriceNum = parseInt(String(minPrice));
    const maxPriceNum = parseInt(String(maxPrice));
    const bedroomsNum = parseInt(String(bedrooms));
    const bathroomsNum = parseInt(String(bathrooms));
    const isFeatured = featured === 'true';

    const offset = (pageNum - 1) * limitNum;

    let whereConditions = and(
      eq(properties.status, 'approved'),
      eq(properties.isActive, true),
      eq(properties.isVisible, true)
    );

    // Add search filters if provided
    if (searchTerm) {
      whereConditions = and(
        whereConditions,
        or(
          sql`${properties.title} ILIKE ${`%${searchTerm}%`}`,
          sql`${properties.description} ILIKE ${`%${searchTerm}%`}`,
          sql`${properties.location} ILIKE ${`%${searchTerm}%`}`
        )
      );
    }

    if (locationTerm) {
      whereConditions = and(
        whereConditions,
        sql`${properties.location} ILIKE ${`%${locationTerm}%`}`
      );
    }

    if (bedroomsNum > 0) {
      whereConditions = and(whereConditions, eq(properties.bedrooms, bedroomsNum));
    }

    if (bathroomsNum > 0) {
      whereConditions = and(whereConditions, eq(properties.bathrooms, bathroomsNum));
    }

    if (isFeatured) {
      whereConditions = and(whereConditions, eq(properties.featured, true));
    }

    const publicProperties = await db.select({
      id: properties.id,
      title: properties.title,
      description: properties.description,
      price: properties.price,
      priceUnit: properties.priceUnit,
      images: properties.images,
      location: properties.location,
      bedrooms: properties.bedrooms,
      bathrooms: properties.bathrooms,
      capacity: properties.capacity,
      amenities: properties.amenities,
      featured: properties.featured,
      rating: properties.rating,
      reviewCount: properties.reviewCount,
      createdAt: properties.createdAt,
      approvedAt: properties.approvedAt,
      host: {
        id: users.id,
        name: users.name
      }
    })
    .from(properties)
    .leftJoin(users, eq(properties.hostId, users.id))
    .where(whereConditions)
    .orderBy(
      desc(properties.featured),
      desc(properties.rating),
      desc(properties.approvedAt)
    )
    .limit(limitNum)
    .offset(offset);

    // Get total count
    const totalQuery = await db.select({ 
      count: sql`count(*)`.mapWith(Number)
    })
    .from(properties)
    .where(whereConditions);

    const total = totalQuery[0]?.count || 0;

    res.json({
      success: true,
      properties: publicProperties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching public properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
}
