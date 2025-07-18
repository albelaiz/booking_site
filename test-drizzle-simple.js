// test-drizzle-simple.js  
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import mysql from "mysql2/promise";

const main = async () => {
  console.log("🔍 Testing Drizzle ORM Connection...\n");

  // Create connection
  const connection = await mysql.createConnection({
    host: '172.233.120.178',
    port: 3306,
    user: 'tamudastay',
    password: 'DAdAH@&&1206',
    database: 'myapp_db',
  });

  const db = drizzle(connection, { mode: "default" });

  try {
    console.log("✅ Drizzle ORM connected successfully");

    // Test raw query
    console.log("🧪 Testing raw query...");
    const result = await db.execute(sql`SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'myapp_db'`);
    console.log("✅ Query executed:", result);

    console.log("\n🎉 Drizzle ORM connection test successful!");

  } catch (error) {
    console.error("❌ Drizzle ORM test failed:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
};

main().catch(console.error);
