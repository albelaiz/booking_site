import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_q1z9sMVxvKyd@ep-purple-bush-a8ywb6z1-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require';

async function runMigration() {
  const connection = postgres(DATABASE_URL);
  const db = drizzle(connection);

  try {
    console.log('Starting property approval system migration...');

    // Add new columns to properties table
    await db.execute(sql`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS host_id INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP NULL,
      ADD COLUMN IF NOT EXISTS rules TEXT,
      ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0
    `);

    console.log('✓ Added new columns to properties table');

    // Update existing properties to have host_id same as owner_id if not set
    await db.execute(sql`
      UPDATE properties 
      SET host_id = owner_id 
      WHERE host_id IS NULL AND owner_id IS NOT NULL
    `);

    console.log('✓ Updated host_id for existing properties');

    // Create indexes
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_properties_active_visible 
      ON properties(is_active, is_visible, approved_at DESC)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_properties_host_id 
      ON properties(host_id, created_at DESC)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_properties_status 
      ON properties(status, created_at DESC)
    `);

    console.log('✓ Created database indexes');

    // Update existing approved properties to be visible
    await db.execute(sql`
      UPDATE properties 
      SET is_active = true, 
          is_visible = true, 
          approved_at = COALESCE(reviewed_at, created_at)
      WHERE status = 'approved'
    `);

    console.log('✓ Updated existing approved properties visibility');

    // Ensure rejected and pending properties are not visible
    await db.execute(sql`
      UPDATE properties 
      SET is_active = false, 
          is_visible = false
      WHERE status IN ('rejected', 'pending')
    `);

    console.log('✓ Updated rejected/pending properties visibility');

    console.log('🎉 Property approval system migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

runMigration().catch(console.error);
