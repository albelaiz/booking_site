import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_q1z9sMVxvKyd@ep-purple-bush-a8ywb6z1-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(databaseUrl);

try {
  console.log('Checking properties table structure...');
  const result = await sql`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    ORDER BY ordinal_position
  `;
  
  console.log('\nProperties table columns:');
  result.forEach(col => {
    console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
  });
  
  console.log('\nChecking if host_id column exists...');
  const hostIdCheck = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'host_id'
  `;
  
  if (hostIdCheck.length > 0) {
    console.log('✅ host_id column exists');
  } else {
    console.log('❌ host_id column does NOT exist');
    console.log('Need to add host_id column to database');
  }
  
} catch (error) {
  console.error('Error checking database:', error);
}
