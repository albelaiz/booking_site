import { connectMongoDB } from './server/config/mongodb';
import { mongoStorage } from './server/storage/mongoStorage';
import { mongoStorageAdapter } from './server/adapters/mongoAdapter';

async function testMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectMongoDB();
    console.log('✅ MongoDB connected successfully');

    console.log('\n🔄 Seeding database...');
    await mongoStorage.seedDatabase();
    console.log('✅ Database seeded successfully');

    console.log('\n🔄 Testing basic operations...');
    
    // Test user operations
    const users = await mongoStorageAdapter.getAllUsers();
    console.log(`✅ Found ${users.length} users`);

    // Test property operations
    const properties = await mongoStorageAdapter.getAllProperties();
    console.log(`✅ Found ${properties.length} properties`);

    // Test getting pending properties (admin function)
    const pendingProperties = await mongoStorageAdapter.getPropertiesByStatus('pending');
    console.log(`✅ Found ${pendingProperties.length} pending properties`);

    // Test bookings
    const bookings = await mongoStorageAdapter.getAllBookings();
    console.log(`✅ Found ${bookings.length} bookings`);

    console.log('\n🎉 MongoDB migration test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Properties: ${properties.length}`);
    console.log(`   - Pending Properties: ${pendingProperties.length}`);
    console.log(`   - Bookings: ${bookings.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
    process.exit(1);
  }
}

testMongoDB();
