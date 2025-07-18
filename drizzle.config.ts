
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://tamudastay:DAdAH%40%26%261206@172.233.120.178:3306/myapp_db';

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
