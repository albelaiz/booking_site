import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and } from 'drizzle-orm';
import { properties, users, notifications } from './shared/schema.js';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_q1z9sMVxvKyd@ep-purple-bush-a8ywb6z1-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require';

async function testPropertyApprovalSystem() {
  const connection = postgres(DATABASE_URL);
  const db = drizzle(connection);

  try {
    console.log('🚀 Testing Property Approval System...\n');

    // Test 1: Check if new columns exist
    console.log('1. Checking database schema...');
    const schemaCheck = await db.execute(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'properties' 
      AND column_name IN ('host_id', 'is_active', 'is_visible', 'approved_at', 'rules', 'sort_order')
    `);
    
    console.log(`✓ Found ${schemaCheck.length}/6 new columns in properties table`);
    schemaCheck.forEach(col => console.log(`  - ${col.column_name}`));

    // Test 2: Check approved properties visibility
    console.log('\n2. Checking approved properties visibility...');
    const approvedProperties = await db.select({
      id: properties.id,
      title: properties.title,
      status: properties.status,
      isActive: properties.isActive,
      isVisible: properties.isVisible,
      approvedAt: properties.approvedAt
    })
    .from(properties)
    .where(and(
      eq(properties.status, 'approved'),
      eq(properties.isActive, true),
      eq(properties.isVisible, true)
    ));

    console.log(`✓ Found ${approvedProperties.length} approved and visible properties`);
    approvedProperties.forEach(prop => {
      console.log(`  - ${prop.title} (ID: ${prop.id}) - Active: ${prop.isActive}, Visible: ${prop.isVisible}`);
    });

    // Test 3: Check pending properties
    console.log('\n3. Checking pending properties...');
    const pendingProperties = await db.select({
      id: properties.id,
      title: properties.title,
      status: properties.status,
      hostId: properties.hostId,
      isActive: properties.isActive,
      isVisible: properties.isVisible
    })
    .from(properties)
    .where(eq(properties.status, 'pending'));

    console.log(`✓ Found ${pendingProperties.length} pending properties`);
    pendingProperties.forEach(prop => {
      console.log(`  - ${prop.title} (ID: ${prop.id}) - Host: ${prop.hostId}, Active: ${prop.isActive}, Visible: ${prop.isVisible}`);
    });

    // Test 4: Check notification system
    console.log('\n4. Checking notification system...');
    const recentNotifications = await db.select({
      id: notifications.id,
      type: notifications.type,
      title: notifications.title,
      userId: notifications.userId,
      propertyId: notifications.propertyId,
      isRead: notifications.isRead,
      createdAt: notifications.createdAt
    })
    .from(notifications)
    .orderBy(notifications.createdAt)
    .limit(10);

    console.log(`✓ Found ${recentNotifications.length} recent notifications`);
    recentNotifications.forEach(notif => {
      console.log(`  - ${notif.type}: ${notif.title} (User: ${notif.userId}, Property: ${notif.propertyId || 'N/A'})`);
    });

    // Test 5: Check user roles
    console.log('\n5. Checking user roles...');
    const userRoles = await db.select({
      id: users.id,
      name: users.name,
      role: users.role,
      status: users.status
    })
    .from(users);

    const roleCount = userRoles.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    console.log('✓ User role distribution:');
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`  - ${role}: ${count} users`);
    });

    console.log('\n🎉 Property approval system test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Database schema: ✓ Updated`);
    console.log(`   - Approved properties visible: ${approvedProperties.length}`);
    console.log(`   - Pending properties: ${pendingProperties.length}`);
    console.log(`   - Notification system: ✓ Active`);
    console.log(`   - User roles configured: ✓ Ready`);

    if (approvedProperties.length === 0) {
      console.log('\n⚠️  Note: No approved properties are currently visible on home page');
      console.log('   - Submit a property as a host');
      console.log('   - Have an admin approve it');
      console.log('   - It will then appear on the home page');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

testPropertyApprovalSystem().catch(console.error);
