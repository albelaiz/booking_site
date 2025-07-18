// test-db-connection.js
const mysql = require('mysql2/promise');

(async () => {
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

  await connection.end();
})();
