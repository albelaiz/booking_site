// test-db-connection.js
import mysql from 'mysql2/promise';

const main = async () => {
  console.log("🔍 Testing MySQL Database Connection...\n");

  const connection = await mysql.createConnection({
    host: '172.233.120.178',
    port: 3306,
    user: 'tamudastay',
    password: 'DAdAH@&&1206',
    database: 'myapp_db',
  });

  console.log("✅ Successfully connected to MySQL!");
  console.log("🧪 Testing basic query...");

  const [rows] = await connection.query('SELECT NOW() AS time');
  console.log("🕒 Server time:", rows[0].time);

  // Test table creation permissions
  console.log("🔧 Testing table creation permissions...");
  const testTable = `test_table_${Date.now()}`;
  
  try {
    await connection.query(`CREATE TABLE ${testTable} (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255))`);
    console.log("✅ Table creation successful");
    
    await connection.query(`INSERT INTO ${testTable} (name) VALUES ('test')`);
    console.log("✅ Insert operation successful");
    
    const [testRows] = await connection.query(`SELECT * FROM ${testTable}`);
    console.log("✅ Select operation successful:", testRows);
    
    await connection.query(`DROP TABLE ${testTable}`);
    console.log("✅ Table deletion successful");
    
  } catch (error) {
    console.error("❌ Permission test failed:", error.message);
  }

  console.log("🗄️ Checking existing tables...");
  const [tables] = await connection.query('SHOW TABLES');
  console.log(`📊 Found ${tables.length} existing tables:`, tables.map(t => Object.values(t)[0]));

  await connection.end();
  console.log("\n🎉 All tests completed successfully!");
};

main();
