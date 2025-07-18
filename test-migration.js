#!/usr/bin/env node

import mysql from 'mysql2/promise';

async function testDrizzleMigration() {
  console.log('🧪 Testing Drizzle Migration Process...\n');
  
  const dbUrl = 'mysql://tamudastay:DAdAH%40%26%261206@172.233.120.178:3306/myapp_db';
  
  try {
    console.log('1️⃣ Testing database connection...');
    const url = new URL(dbUrl);
    const connection = await mysql.createConnection({
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
      connectTimeout: 10000
    });
    
    console.log('✅ Database connection successful');
    
    console.log('2️⃣ Checking for migration table...');
    try {
      const [tables] = await connection.execute("SHOW TABLES LIKE '__drizzle_migrations'");
      if (tables.length > 0) {
        console.log('✅ Migration table exists');
        const [migrations] = await connection.execute('SELECT * FROM __drizzle_migrations ORDER BY created_at DESC LIMIT 5');
        console.log(`📊 Found ${migrations.length} recent migrations`);
      } else {
        console.log('ℹ️  Migration table doesn\'t exist yet (normal for first run)');
      }
    } catch (error) {
      console.log('ℹ️  Migration table check failed (normal for first run)');
    }
    
    console.log('3️⃣ Testing table creation permissions...');
    const testTableName = `test_permissions_${Date.now()}`;
    await connection.execute(`CREATE TABLE ${testTableName} (id INT PRIMARY KEY)`);
    await connection.execute(`DROP TABLE ${testTableName}`);
    console.log('✅ Table creation/deletion permissions working');
    
    await connection.end();
    console.log('\n🎉 All migration tests passed! Ready for deployment.');
    
  } catch (error) {
    console.error('\n❌ Migration test failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    process.exit(1);
  }
}

testDrizzleMigration();
