
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
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

// Fallback URL for development
if (!DATABASE_URL) {
  DATABASE_URL = 'postgresql://neondb_owner:npg_q1z9sMVxvKyd@ep-purple-bush-a8ywb6z1-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require';
}

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });

// Legacy exports for compatibility (can be removed once routes are updated)
export const pool = null; // Not needed for Neon
