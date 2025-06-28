
import { storage } from "./storage";

export async function seedDatabase() {
  try {
    console.log("Seeding database with initial data...");
    
    // Check if users already exist
    const existingUsers = await storage.getAllUsers();
    if (existingUsers.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Create default users
    const defaultUsers = [
      {
        username: "admin",
        password: "password123",
        role: "admin",
        name: "Admin User",
        email: "admin@bluebay.com",
        status: "active"
      },
      {
        username: "staff",
        password: "password123",
        role: "staff",
        name: "Staff User",
        email: "staff@bluebay.com",
        status: "active"
      },
      {
        username: "owner",
        password: "password123",
        role: "owner",
        name: "Property Owner",
        email: "owner@bluebay.com",
        status: "active"
      },
      {
        username: "user",
        password: "password123",
        role: "user",
        name: "Regular User",
        email: "user@bluebay.com",
        status: "active"
      }
    ];

    for (const user of defaultUsers) {
      try {
        await storage.createUser(user);
        console.log(`Created user: ${user.username}`);
      } catch (error) {
        console.log(`User ${user.username} might already exist, skipping...`);
      }
    }

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
    // Don't throw error to prevent app from crashing
  }
}
