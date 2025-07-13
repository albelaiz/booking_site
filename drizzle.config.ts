
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_q1z9sMVxvKyd@ep-purple-bush-a8ywb6z1-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require';

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
