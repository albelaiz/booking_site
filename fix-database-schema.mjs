import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_q1z9sMVxvKyd@ep-purple-bush-a8ywb6z1-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(databaseUrl);

try {
  console.log('🔧 Adding missing host_id column to properties table...');
  
  // Add host_id column that references users table
  await sql`
    ALTER TABLE properties 
    ADD COLUMN host_id INTEGER REFERENCES users(id);
  `;
  
  console.log('✅ Successfully added host_id column');
  
  // Update existing properties to set host_id = owner_id (backward compatibility)
  console.log('🔄 Setting host_id = owner_id for existing properties...');
  await sql`
    UPDATE properties 
    SET host_id = owner_id 
    WHERE host_id IS NULL AND owner_id IS NOT NULL;
  `;
  
  console.log('✅ Successfully updated existing properties');
  
  // Add missing columns if they don't exist
  console.log('🔧 Adding other missing columns...');
  
  try {
    await sql`ALTER TABLE properties ADD COLUMN is_active BOOLEAN DEFAULT false;`;
    console.log('✅ Added is_active column');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('ℹ️ is_active column already exists');
    } else {
      console.log('❌ Error adding is_active:', e.message);
    }
  }
  
  try {
    await sql`ALTER TABLE properties ADD COLUMN is_visible BOOLEAN DEFAULT false;`;
    console.log('✅ Added is_visible column');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('ℹ️ is_visible column already exists');
    } else {
      console.log('❌ Error adding is_visible:', e.message);
    }
  }
  
  try {
    await sql`ALTER TABLE properties ADD COLUMN approved_at TIMESTAMP;`;
    console.log('✅ Added approved_at column');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('ℹ️ approved_at column already exists');
    } else {
      console.log('❌ Error adding approved_at:', e.message);
    }
  }
  
  try {
    await sql`ALTER TABLE properties ADD COLUMN rules TEXT;`;
    console.log('✅ Added rules column');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('ℹ️ rules column already exists');
    } else {
      console.log('❌ Error adding rules:', e.message);
    }
  }
  
  try {
    await sql`ALTER TABLE properties ADD COLUMN sort_order INTEGER DEFAULT 0;`;
    console.log('✅ Added sort_order column');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('ℹ️ sort_order column already exists');
    } else {
      console.log('❌ Error adding sort_order:', e.message);
    }
  }
  
  // Update approved properties to be active and visible
  console.log('🔄 Setting approved properties to be active and visible...');
  await sql`
    UPDATE properties 
    SET is_active = true, is_visible = true, approved_at = updated_at
    WHERE status = 'approved' AND is_active IS NOT true;
  `;
  
  console.log('✅ Successfully updated approved properties');
  
  // Verify the changes
  console.log('\n📊 Verifying database schema...');
  const result = await sql`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name IN ('host_id', 'is_active', 'is_visible', 'approved_at', 'rules', 'sort_order')
    ORDER BY column_name
  `;
  
  console.log('New columns:');
  result.forEach(col => {
    console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
  });
  
  console.log('\n🎉 Database schema migration completed successfully!');
  
} catch (error) {
  console.error('❌ Error during migration:', error);
}
