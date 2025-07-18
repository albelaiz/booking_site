
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

// Clean up the DATABASE_URL by removing psql command and quotes
let DATABASE_URL = process.env.DATABASE_URL || '';

// Remove psql command prefix and quotes if they exist
if (DATABASE_URL.startsWith("psql '") && DATABASE_URL.endsWith("'")) {
  DATABASE_URL = DATABASE_URL.slice(6, -1);
} else if (DATABASE_URL.startsWith("'") && DATABASE_URL.endsWith("'")) {
  DATABASE_URL = DATABASE_URL.slice(1, -1);
} else if (DATABASE_URL.startsWith('"') && DATABASE_URL.endsWith('"')) {
  DATABASE_URL = DATABASE_URL.slice(1, -1);
}

// Fallback URL for development (URL-encoded)
if (!DATABASE_URL) {
  DATABASE_URL = 'mysql://tamudastay:DAdAH%40%26%261206@172.233.120.178:3306/myapp_db';
}

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const db = drizzle(DATABASE_URL, { schema, mode: "default" });

// Legacy exports for compatibility (can be removed once routes are updated)
export const pool = null; // Not needed for MySQL2
