import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPropertySchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route
  app.get("/api/health", async (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      // Try to find user by username or email
      let user = await storage.getUserByUsername(username);
      if (!user) {
        user = await storage.getUserByEmail(username);
      }

      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      if (userData.email) {
        const existingEmailUser = await storage.getUserByEmail(userData.email);
        if (existingEmailUser) {
          return res.status(409).json({ error: "Email already exists" });
        }
      }

      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password: _, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      console.log("Creating user with data:", req.body);
      
      // Validate required fields
      if (!req.body.username || !req.body.name || !req.body.email) {
        return res.status(400).json({ error: "Username, name, and email are required" });
      }

      // For new users, password is required
      if (!req.body.password) {
        return res.status(400).json({ error: "Password is required for new users" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      const existingEmailUser = await storage.getUserByEmail(req.body.email);
      if (existingEmailUser) {
        return res.status(409).json({ error: "Email already exists" });
      }

      // Create user data object
      const userData = {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone || null,
        role: req.body.role || "user",
        status: req.body.status || "active"
      };

      console.log("Validated user data:", userData);
      
      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      
      console.log("User created successfully:", userWithoutPassword);
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Create user error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      console.log("Updating user", id, "with data:", req.body);

      const updateData = { ...req.body };
      // Remove empty password field if present
      if (updateData.password === "") {
        delete updateData.password;
      }

      const user = await storage.updateUser(id, updateData);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      console.log("Deleting user with ID:", id);

      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Property routes
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      console.error("Get properties error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Get property error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid property data", details: error.errors });
      }
      console.error("Create property error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }

      const updateData = req.body;
      const property = await storage.updateProperty(id, updateData);
      
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Update property error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }

      const deleted = await storage.deleteProperty(id);
      if (!deleted) {
        return res.status(404).json({ error: "Property not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Delete property error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Booking routes
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Get bookings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid booking ID" });
      }

      const booking = await storage.getBooking(id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      res.json(booking);
    } catch (error) {
      console.error("Get booking error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      console.error("Create booking error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid booking ID" });
      }

      const updateData = req.body;
      const booking = await storage.updateBooking(id, updateData);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      res.json(booking);
    } catch (error) {
      console.error("Update booking error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
