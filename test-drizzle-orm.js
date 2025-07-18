// test-drizzle-orm.js
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./shared/schema.js";

const main = async () => {
  console.log("🔍 Testing Drizzle ORM Integration...\n");

  // Create connection
  const connection = mysql.createConnection({
    host: '172.233.120.178',
    port: 3306,
    user: 'tamudastay',
    password: 'DAdAH@&&1206',
    database: 'myapp_db',
  });

  const db = drizzle(connection, { schema, mode: "default" });

  try {
    console.log("✅ Drizzle ORM connected successfully");

    // Test inserting a user
    console.log("🧪 Testing user insertion...");
    const insertResult = await db.insert(schema.users).values({
      username: 'testuser',
      password: 'hashedpassword',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      status: 'active'
    });
    
    console.log("✅ User inserted successfully");

    // Test querying users
    console.log("🔍 Testing user query...");
    const users = await db.select().from(schema.users);
    console.log("✅ Users found:", users.length);
    console.log("👤 First user:", users[0]);

    // Test updating user
    console.log("📝 Testing user update...");
    await db.update(schema.users)
      .set({ name: 'Updated Test User' })
      .where(schema.users.username.eq('testuser'));
    
    const updatedUsers = await db.select().from(schema.users).where(schema.users.username.eq('testuser'));
    console.log("✅ User updated:", updatedUsers[0].name);

    // Test property insertion
    console.log("🏠 Testing property insertion...");
    const propertyResult = await db.insert(schema.properties).values({
      title: 'Test Property',
      description: 'A beautiful test property',
      price: '100.00',
      priceUnit: 'night',
      location: 'Test City',
      bedrooms: 2,
      bathrooms: 1,
      capacity: 4,
      ownerId: users[0].id,
      status: 'approved'
    });

    console.log("✅ Property inserted successfully");

    // Test querying properties with relations
    console.log("🏠 Testing property query...");
    const properties = await db.select().from(schema.properties);
    console.log("✅ Properties found:", properties.length);

    // Clean up test data
    console.log("🧹 Cleaning up test data...");
    await db.delete(schema.properties);
    await db.delete(schema.users);
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 All Drizzle ORM tests completed successfully!");

  } catch (error) {
    console.error("❌ Drizzle ORM test failed:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
};

main().catch(console.error);
