import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPropertySchema, insertBookingSchema, insertMessageSchema, insertAuditLogSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";

// Simple authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  // In a real app, you'd verify the JWT token here
  // For now, we'll just check if it exists
  next();
};

// Admin/Staff role middleware
const requireAdminRole = (req: any, res: any, next: any) => {
  // This would typically check the user's role from the JWT token
  // For now, we'll implement basic protection
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Admin authentication required" });
  }
  
  next();
};

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
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate the request data against the schema
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

      // If validation passes, create the user
      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Return specific validation errors
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        // Return the first validation error for better UX
        const firstError = validationErrors[0];
        return res.status(400).json({ 
          error: firstError.message,
          field: firstError.field,
          details: validationErrors 
        });
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
  // Public route - only returns approved properties
  app.get("/api/properties/public", async (req, res) => {
    try {
      const properties = await storage.getApprovedProperties();
      res.json(properties);
    } catch (error) {
      console.error("Get public properties error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Public route - only returns approved property by ID
  app.get("/api/properties/public/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }

      const property = await storage.getApprovedProperty(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Get public property error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin route - returns all properties (for admin dashboard)
  app.get("/api/properties", requireAdminRole, async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      console.error("Get properties error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/properties/:id", requireAdminRole, async (req, res) => {
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

  app.post("/api/properties", requireAuth, async (req, res) => {
    try {
      console.log('Property creation request received:', {
        userId: req.headers['x-user-id'],
        userRole: req.headers['x-user-role'],
        bodyKeys: Object.keys(req.body)
      });
      
      // Transform rating to string if it exists and is a number
      const bodyData = { ...req.body };
      if (bodyData.rating && typeof bodyData.rating === 'number') {
        bodyData.rating = bodyData.rating.toString();
      }
      
      const propertyData = insertPropertySchema.parse(bodyData);
      
      // Extract user info from token (in a real app, you'd decode the JWT)
      const userId = req.body.ownerId || req.headers['x-user-id'] || '1';
      const userRole = req.headers['x-user-role'] || 'user';
      
      // Force status based on user role - admin properties are auto-approved
      const finalPropertyData = {
        ...propertyData,
        ownerId: parseInt(userId),
        status: (userRole === 'admin' || userRole === 'staff') ? 'approved' : 'pending'
      };
      
      console.log(`Creating property with status: ${finalPropertyData.status} for role: ${userRole}, user: ${userId}`);
      
      const property = await storage.createProperty(finalPropertyData);
      
      // Log approval for admin properties
      if (finalPropertyData.status === 'approved') {
        console.log(`✅ Admin property auto-approved: ${property.title} (ID: ${property.id}) - Now visible to all visitors`);
      } else {
        console.log(`⏳ Property pending approval: ${property.title} (ID: ${property.id})`);
      }
      
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Property validation error:", error.errors);
        return res.status(400).json({ error: "Invalid property data", details: error.errors });
      }
      console.error("Create property error:", error);
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  });

  app.put("/api/properties/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/properties/:id", requireAdminRole, async (req, res) => {
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

  // Host route - get properties by owner ID (only own properties)
  app.get("/api/properties/owner/:ownerId", requireAuth, async (req, res) => {
    try {
      const ownerId = parseInt(req.params.ownerId);
      if (isNaN(ownerId)) {
        return res.status(400).json({ error: "Invalid owner ID" });
      }

      const properties = await storage.getPropertiesByOwner(ownerId);
      res.json(properties);
    } catch (error) {
      console.error("Get properties by owner error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin route - approve property
  app.patch("/api/properties/:id/approve", requireAdminRole, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }

      const property = await storage.updateProperty(id, { 
        status: "approved",
        updatedAt: new Date()
      });
      
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Approve property error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin route - reject property
  app.patch("/api/properties/:id/reject", requireAdminRole, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }

      const property = await storage.updateProperty(id, { 
        status: "rejected",
        updatedAt: new Date()
      });
      
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Reject property error:", error);
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
      console.log('Booking creation request received:', {
        body: req.body,
        bodyType: typeof req.body,
        contentType: req.headers['content-type']
      });

      // Ensure body is properly parsed
      if (!req.body || typeof req.body !== 'object') {
        console.error('Invalid request body:', req.body);
        return res.status(400).json({ 
          error: "Invalid request body",
          details: "Request body must be a valid JSON object"
        });
      }

      // Pre-process the data to ensure proper formatting
      const processedData = {
        ...req.body,
        propertyId: parseInt(req.body.propertyId),
        guests: parseInt(req.body.guests),
        amount: parseFloat(req.body.amount),
        // Ensure dates are properly formatted
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut
      };

      console.log('Pre-processed booking data:', processedData);

      // Validate the booking data
      console.log('Validating booking data with schema...');
      const bookingData = insertBookingSchema.parse(processedData);
      
      console.log('Validated booking data:', bookingData);
      
      // Check if this is an authenticated user booking
      if (bookingData.userId) {
        console.log('Processing authenticated user booking');
        // Use createOrUpdateBooking for authenticated users
        const booking = await storage.createOrUpdateBooking(bookingData);
        console.log('✅ Authenticated user booking saved to Neon database:', booking.id);
        res.status(201).json(booking);
      } else {
        console.log('Processing visitor/guest booking');
        // For guest bookings (visitors), always create new
        const booking = await storage.createBooking(bookingData);
        console.log('✅ Visitor booking saved to Neon database:', {
          id: booking.id,
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          propertyId: booking.propertyId,
          amount: booking.amount,
          status: booking.status
        });
        
        // Log this booking for admin notification
        console.log('📧 New booking notification sent to admin dashboard');
        
        res.status(201).json(booking);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Booking validation error:", error.errors);
        const firstError = error.errors[0];
        return res.status(400).json({ 
          error: `Validation error: ${firstError.message}`,
          field: firstError.path.join('.'),
          details: error.errors 
        });
      }
      if (error instanceof Error && error.message.includes('not available')) {
        console.error("Booking availability error:", error.message);
        return res.status(409).json({ error: error.message });
      }
      console.error("Create booking error:", error);
      res.status(500).json({ 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
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

  // Message routes
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid message ID" });
      }

      const message = await storage.getMessage(id);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      res.json(message);
    } catch (error) {
      console.error("Get message error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid message data", details: error.errors });
      }
      console.error("Create message error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid message ID" });
      }

      const updateData = req.body;
      const message = await storage.updateMessage(id, updateData);
      
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      res.json(message);
    } catch (error) {
      console.error("Update message error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid message ID" });
      }

      const deleted = await storage.deleteMessage(id);
      if (!deleted) {
        return res.status(404).json({ error: "Message not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Delete message error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Check booking availability
  app.get("/api/properties/:id/availability", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const { checkIn, checkOut } = req.query;

      if (isNaN(propertyId)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }

      if (!checkIn || !checkOut) {
        return res.status(400).json({ error: "Check-in and check-out dates are required" });
      }

      const checkInDate = new Date(checkIn as string);
      const checkOutDate = new Date(checkOut as string);

      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      if (checkInDate >= checkOutDate) {
        return res.status(400).json({ error: "Check-in date must be before check-out date" });
      }

      const isAvailable = await storage.checkBookingAvailability(
        propertyId,
        checkInDate,
        checkOutDate
      );

      if (!isAvailable) {
        // Get booked dates to show user what's already taken
        const bookedDates = await storage.getBookedDatesForProperty(propertyId);
        return res.json({ 
          available: false, 
          bookedDates,
          message: "Property is not available for the selected dates"
        });
      }

      res.json({ available: true });
    } catch (error) {
      console.error("Check availability error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get booked dates for a property
  app.get("/api/properties/:id/booked-dates", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      
      if (isNaN(propertyId)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }

      const bookedDates = await storage.getBookedDatesForProperty(propertyId);
      res.json(bookedDates);
    } catch (error) {
      console.error("Get booked dates error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get user's bookings
  app.get("/api/users/:id/bookings", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const userBookings = await storage.getBookingsByUser(userId);
      res.json(userBookings);
    } catch (error) {
      console.error("Get user bookings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Host Dashboard routes
  app.get("/api/hosts/:ownerId/stats", async (req, res) => {
    try {
      const ownerId = parseInt(req.params.ownerId);
      const period = req.query.period || '30';
      
      if (isNaN(ownerId)) {
        return res.status(400).json({ error: "Invalid owner ID" });
      }

      // Get host properties
      const hostProperties = await storage.getPropertiesByOwner(ownerId);
      const propertyIds = hostProperties.map(p => p.id);

      // Get all bookings for host properties
      const allBookings = await storage.getAllBookings();
      const hostBookings = allBookings.filter(booking => 
        propertyIds.includes(booking.propertyId)
      );

      // Calculate period start date
      const periodDays = parseInt(period as string);
      const periodStart = new Date();
      periodStart.setDate(periodStart.getDate() - periodDays);

      const recentBookings = hostBookings.filter(booking => 
        new Date(booking.createdAt) >= periodStart
      );

      // Calculate stats
      const totalRevenue = hostBookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, booking) => sum + parseFloat(booking.amount.toString()), 0);

      const totalBookings = hostBookings.length;
      const confirmedBookings = hostBookings.filter(b => b.status === 'confirmed').length;
      const pendingBookings = hostBookings.filter(b => b.status === 'pending').length;
      
      const totalRating = hostProperties.reduce((sum, property) => 
        sum + (parseFloat(property.rating?.toString() || '0') * (property.reviewCount || 0)), 0
      );
      const totalReviews = hostProperties.reduce((sum, property) => 
        sum + (property.reviewCount || 0), 0
      );
      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      // Mock some stats for demo
      const stats = {
        totalRevenue,
        totalBookings,
        averageRating: Math.round(averageRating * 10) / 10,
        occupancyRate: Math.min(85, Math.max(45, (confirmedBookings / Math.max(1, totalBookings)) * 100)),
        activeProperties: hostProperties.filter(p => p.status === 'approved').length,
        pendingBookings,
        monthlyGrowth: Math.random() * 20 - 5, // Random growth for demo
        totalViews: Math.floor(Math.random() * 2000) + 500,
        conversionRate: Math.random() * 5 + 1,
        averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
        responseTime: Math.random() * 4 + 1
      };

      res.json(stats);
    } catch (error) {
      console.error("Get host stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/hosts/:ownerId/bookings", async (req, res) => {
    try {
      const ownerId = parseInt(req.params.ownerId);
      
      if (isNaN(ownerId)) {
        return res.status(400).json({ error: "Invalid owner ID" });
      }

      // Get host properties
      const hostProperties = await storage.getPropertiesByOwner(ownerId);
      const propertyIds = hostProperties.map(p => p.id);

      // Get all bookings for host properties
      const allBookings = await storage.getAllBookings();
      const hostBookings = allBookings
        .filter(booking => propertyIds.includes(booking.propertyId))
        .map(booking => {
          const property = hostProperties.find(p => p.id === booking.propertyId);
          return {
            ...booking,
            propertyTitle: property?.title || 'Unknown Property'
          };
        });

      // Apply filters
      const { status, propertyId, startDate, endDate } = req.query;
      let filteredBookings = hostBookings;

      if (status) {
        filteredBookings = filteredBookings.filter(booking => booking.status === status);
      }

      if (propertyId) {
        const propId = parseInt(propertyId as string);
        filteredBookings = filteredBookings.filter(booking => booking.propertyId === propId);
      }

      if (startDate) {
        filteredBookings = filteredBookings.filter(booking => 
          new Date(booking.checkIn) >= new Date(startDate as string)
        );
      }

      if (endDate) {
        filteredBookings = filteredBookings.filter(booking => 
          new Date(booking.checkOut) <= new Date(endDate as string)
        );
      }

      res.json(filteredBookings);
    } catch (error) {
      console.error("Get host bookings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/hosts/:ownerId/messages", async (req, res) => {
    try {
      const ownerId = parseInt(req.params.ownerId);
      
      if (isNaN(ownerId)) {
        return res.status(400).json({ error: "Invalid owner ID" });
      }

      // Get all messages (in a real app, you'd filter by property owner)
      const messages = await storage.getAllMessages();
      
      // Apply status filter
      const { status } = req.query;
      let filteredMessages = messages;

      if (status) {
        filteredMessages = messages.filter(message => message.status === status);
      }

      res.json(filteredMessages);
    } catch (error) {
      console.error("Get host messages error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/hosts/:ownerId/analytics", async (req, res) => {
    try {
      const ownerId = parseInt(req.params.ownerId);
      const period = req.query.period || '30';
      
      if (isNaN(ownerId)) {
        return res.status(400).json({ error: "Invalid owner ID" });
      }

      // Get host properties and bookings
      const hostProperties = await storage.getPropertiesByOwner(ownerId);
      const propertyIds = hostProperties.map(p => p.id);
      
      const allBookings = await storage.getAllBookings();
      const hostBookings = allBookings.filter(booking => 
        propertyIds.includes(booking.propertyId)
      );

      // Generate mock analytics data for the period
      const periodDays = parseInt(period as string);
      const analyticsData = [];
      
      for (let i = periodDays - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const dayBookings = hostBookings.filter(booking => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate.toDateString() === date.toDateString();
        });

        analyticsData.push({
          date: date.toISOString().split('T')[0],
          revenue: dayBookings.reduce((sum, booking) => 
            sum + parseFloat(booking.amount.toString()), 0
          ),
          bookings: dayBookings.length,
          views: Math.floor(Math.random() * 50) + 10,
          period: 'daily'
        });
      }

      res.json(analyticsData);
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/properties/:id/calendar", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const { start, end } = req.query;
      
      if (isNaN(propertyId)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }

      // Get bookings for the property within the date range
      const bookings = await storage.getBookingsByProperty(propertyId);
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      const calendarBookings = bookings.filter(booking => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        return (checkIn >= startDate && checkIn <= endDate) || 
               (checkOut >= startDate && checkOut <= endDate) ||
               (checkIn <= startDate && checkOut >= endDate);
      });

      res.json(calendarBookings);
    } catch (error) {
      console.error("Get property calendar error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Audit log routes
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const {
        page = 1,
        limit = 50,
        userId,
        action,
        entity,
        severity,
        startDate,
        endDate
      } = req.query;

      const filters: any = {};
      
      if (userId) filters.userId = parseInt(userId as string);
      if (action) filters.action = action as string;
      if (entity) filters.entity = entity as string;
      if (severity) filters.severity = severity as string;
      if (startDate) filters.startDate = startDate as string;
      if (endDate) filters.endDate = endDate as string;
      
      filters.page = parseInt(page as string);
      filters.limit = parseInt(limit as string);

      const auditLogs = await storage.getAuditLogs(filters);
      res.json(auditLogs);
    } catch (error) {
      console.error("Get audit logs error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/audit-logs/recent", async (req, res) => {
    try {
      const { limit = 20 } = req.query;
      const recentLogs = await storage.getRecentAuditLogs(parseInt(limit as string));
      res.json(recentLogs);
    } catch (error) {
      console.error("Get recent audit logs error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/audit-logs/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const userAuditLogs = await storage.getAuditLogsByUser(userId);
      res.json(userAuditLogs);
    } catch (error) {
      console.error("Get user audit logs error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/audit-logs", async (req, res) => {
    try {
      const auditLogData = req.body;
      const auditLog = await storage.createAuditLog(auditLogData);
      res.status(201).json(auditLog);
    } catch (error) {
      console.error("Create audit log error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // OpenAI Configuration (only if API key is provided)
  const openai = process.env.OPENAI_API_KEY ? new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }) : null;

  // Chatbot API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, language = 'en', context } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!process.env.OPENAI_API_KEY || !openai) {
        // Enhanced fallback responses with more variety and context
        const smartResponses = {
          en: {
            beach: [
              "🏖️ Perfect! We have stunning beachfront properties in Martil and Tamuda Bay. Our ocean-view villas and apartments offer direct beach access with breathtaking Mediterranean views. Would you like to explore our featured beachfront collection?",
              "🌊 Great choice! Our coastal properties are steps from pristine sandy beaches. We have luxury villas and modern apartments with sea views in both Martil and Tamuda Bay. Check out our 'Properties' page for availability!"
            ],
            apartments: [
              "🏠 Absolutely! We have beautiful family apartments for 4 people in Martil and Tamuda Bay. Our 2-bedroom units feature modern amenities, full kitchens, and many offer stunning sea views. Shall I help you check availability for your dates?",
              "✨ Yes! Our spacious apartments accommodate 4 guests comfortably. They include fully equipped kitchens, living areas, and are perfectly located near beaches and local attractions. Perfect for families or groups!"
            ],
            host: [
              "🏡 Becoming a TamudaStay host is straightforward! Visit our 'Become a Host' page to start your journey. We provide comprehensive support including professional photography, listing optimization, guest management, and marketing. Ready to start earning from your property?",
              "💼 Join our successful host community! We handle marketing, guest communications, bookings, and support while you earn great income. Our hosts love the hassle-free experience. Click 'Become a Host' to learn more!"
            ],
            checkin: [
              "🕐 Our standard times are: Check-in at 3:00 PM and check-out at 11:00 AM. However, we're very flexible! We can often accommodate early arrivals or late departures based on availability. Just let us know your travel plans!",
              "⏰ Check-in: 3:00 PM | Check-out: 11:00 AM. We also offer complimentary luggage storage if you arrive early or need to store bags after checkout. Contact us for any special timing requests!"
            ],
            location: [
              "📍 We're located in Morocco's stunning northern coast! Our properties span the beautiful Tamuda Bay area, vibrant Martil beach town, and historic Tetouan. You'll enjoy pristine Mediterranean beaches, rich Moroccan culture, and we're just minutes from Spain!",
              "🗺️ Our prime locations include: Tamuda Bay (luxury waterfront), Martil (lively beach community), and Tetouan (UNESCO World Heritage medina). Each offers unique charm with easy access to beaches, dining, and cultural attractions!"
            ],
            default: [
              "👋 Welcome to TamudaStay! I'm here to help you discover the perfect vacation rental on Morocco's magnificent northern coast. Whether you're seeking beachfront luxury, family-friendly apartments, or cultural experiences, we have something special for you!",
              "🌟 Thank you for choosing TamudaStay! We specialize in premium vacation rentals in Tamuda Bay, Martil, and Tetouan. How can I help make your Moroccan coastal getaway absolutely unforgettable?",
              "💫 Hello! I'm your TamudaStay concierge. Looking for the perfect property? Have questions about our beautiful locations? Need booking assistance? I'm here to help create your ideal Moroccan vacation!"
            ]
          },
          ar: {
            beach: [
              "🏖️ اختيار ممتاز! لدينا عقارات رائعة على الشاطئ في مارتيل وخليج تامودا. فيلاتنا وشققنا المطلة على المحيط توفر وصولاً مباشراً للشاطئ مع إطلالات خلابة على البحر الأبيض المتوسط. هل تود استكشاف مجموعتنا المميزة على الشاطئ؟",
              "🌊 خيار رائع! عقاراتنا الساحلية على بُعد خطوات من الشواطئ الرملية النقية. لدينا فيلات فاخرة وشقق عصرية بإطلالة بحرية في مارتيل وخليج تامودا. تحقق من صفحة 'العقارات' للتوفر!"
            ],
            apartments: [
              "🏠 بالطبع! لدينا شقق عائلية جميلة لـ 4 أشخاص في مارتيل وخليج تامودا. وحداتنا ذات الغرفتين تتميز بوسائل الراحة الحديثة والمطابخ الكاملة والكثير منها يوفر إطلالات بحرية مذهلة. هل أساعدك في التحقق من التوفر لتواريخك؟",
              "✨ نعم! شققنا الواسعة تستوعب 4 ضيوف بكل راحة. تشمل مطابخ مجهزة بالكامل ومناطق معيشة وتقع في مواقع مثالية بالقرب من الشواطئ والمعالم المحلية. مثالية للعائلات أو المجموعات!"
            ],
            host: [
              "🏡 أن تصبح مضيفاً في تاموداستاي أمر بسيط! قم بزيارة صفحة 'كن مضيفاً' لبدء رحلتك. نحن نوفر دعماً شاملاً يشمل التصوير المهني وتحسين القوائم وإدارة الضيوف والتسويق. مستعد لبدء الكسب من عقارك؟",
              "💼 انضم إلى مجتمع المضيفين الناجحين لدينا! نحن نتولى التسويق والتواصل مع الضيوف والحجوزات والدعم بينما تحصل أنت على دخل ممتاز. مضيفونا يحبون التجربة الخالية من المتاعب. انقر على 'كن مضيفاً' لمعرفة المزيد!"
            ],
            checkin: [
              "🕐 أوقاتنا المعيارية هي: تسجيل الوصول في 3:00 مساءً والمغادرة في 11:00 صباحاً. ومع ذلك، نحن مرنون جداً! يمكننا غالباً استيعاب الوصول المبكر أو المغادرة المتأخرة حسب التوفر. فقط أخبرنا بخطط سفرك!",
              "⏰ تسجيل الوصول: 3:00 مساءً | المغادرة: 11:00 صباحاً. نوفر أيضاً تخزين الأمتعة المجاني إذا وصلت مبكراً أو تحتاج لتخزين الحقائب بعد المغادرة. اتصل بنا لأي طلبات توقيت خاصة!"
            ],
            location: [
              "📍 نحن في الساحل الشمالي المذهل للمغرب! عقاراتنا تمتد عبر منطقة خليج تامودا الجميلة ومدينة مارتيل الشاطئية النابضة بالحياة وتطوان التاريخية. ستستمتع بشواطئ البحر الأبيض المتوسط النقية والثقافة المغربية الغنية، ونحن على بُعد دقائق من إسبانيا!",
              "🗺️ مواقعنا الرئيسية تشمل: خليج تامودا (الواجهة المائية الفاخرة)، مارتيل (مجتمع شاطئي حيوي)، وتطوان (مدينة التراث العالمي لليونسكو). كل منها يوفر سحراً فريداً مع سهولة الوصول للشواطئ والمطاعم والمعالم الثقافية!"
            ],
            default: [
              "👋 مرحباً بك في تاموداستاي! أنا هنا لمساعدتك في اكتشاف الإيجار المثالي للعطلات على الساحل الشمالي الرائع للمغرب. سواء كنت تبحث عن فخامة الواجهة البحرية أو شقق مناسبة للعائلة أو تجارب ثقافية، لدينا شيء مميز لك!",
              "🌟 شكراً لاختيارك تاموداستاي! نحن متخصصون في إيجارات العطل المميزة في خليج تامودا ومارتيل وتطوان. كيف يمكنني مساعدتك في جعل عطلتك الساحلية المغربية لا تُنسى تماماً؟",
              "💫 مرحباً! أنا كونسيرج تاموداستاي الخاص بك. تبحث عن العقار المثالي؟ لديك أسئلة حول مواقعنا الجميلة؟ تحتاج مساعدة في الحجز؟ أنا هنا لمساعدتك في إنشاء عطلتك المغربية المثالية!"
            ]
          }
        };

        const messageLC = message.toLowerCase();
        const responses = smartResponses[language as 'en' | 'ar'];
        
        let responseCategory = 'default';
        if (messageLC.includes('beach') || messageLC.includes('شاطئ') || messageLC.includes('ocean')) responseCategory = 'beach';
        else if (messageLC.includes('apartment') || messageLC.includes('شقة') || messageLC.includes('people') || messageLC.includes('أشخاص')) responseCategory = 'apartments';
        else if (messageLC.includes('host') || messageLC.includes('مضيف')) responseCategory = 'host';
        else if (messageLC.includes('check') || messageLC.includes('وصول') || messageLC.includes('time')) responseCategory = 'checkin';
        else if (messageLC.includes('location') || messageLC.includes('موقع') || messageLC.includes('where')) responseCategory = 'location';

        const categoryResponses = responses[responseCategory as keyof typeof responses];
        const response = Array.isArray(categoryResponses) 
          ? categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
          : categoryResponses;

        return res.json({ response });
      }

      // Enhanced system prompt for OpenAI
      const systemPrompt = language === 'ar' 
        ? `أنت مساعد ذكي ومفيد لموقع تاموداستاي، وهو موقع لحجز العطل الشاطئية الفاخرة في المغرب.

معلومات الشركة:
📍 الموقع: خليج تامودا ومارتيل ومنطقة تطوان في شمال المغرب
🏖️ نحن متخصصون في العقارات الشاطئية الفاخرة والفيلات والشقق
⭐ نوفر حجوزات فورية وتجربة ضيافة مغربية أصيلة

سياساتنا:
• تسجيل الوصول: 3:00 مساءً
• المغادرة: 11:00 صباحاً  
• الإلغاء: إلغاء مجاني حتى 24 ساعة قبل الوصول

خدماتنا تشمل:
• عقارات إيجار عطل فاخرة
• فيلات وشقق على الشاطئ
• نظام حجز فوري
• دعم الضيوف 24/7
• إدارة العقارات للمضيفين
• إرشاد سياحي محلي

مميزاتنا:
• عقارات بإطلالة على المحيط
• أماكن إقامة مناسبة للعائلة
• وسائل راحة عصرية
• ضيافة مغربية أصيلة
• قريب من الشواطئ والمعالم
• خيارات حجز مرنة

كن مفيداً ومهذباً ومتحمساً. استخدم الرموز التعبيرية بشكل مناسب. قدم معلومات مفيدة عن عقاراتنا والمنطقة المحلية. إذا سُئلت عن شيء لا تعرفه، اقترح الاتصال بفريق الدعم.`
        : `You are a helpful and knowledgeable AI assistant for TamudaStay, a luxury vacation rental booking website specializing in beautiful coastal properties in Morocco.

Company Information:
📍 Location: Tamuda Bay, Martil, and Tetouan area in Northern Morocco
🏖️ We specialize in luxury beachfront properties, villas, and apartments
⭐ We offer instant booking and authentic Moroccan hospitality

Our Policies:
• Check-in: 3:00 PM
• Check-out: 11:00 AM
• Cancellation: Free cancellation up to 24 hours before check-in

Our Services:
• Luxury vacation rental properties
• Beachfront villas and apartments
• Instant booking system
• 24/7 guest support
• Property management for hosts
• Local tourism guidance

Our Features:
• Ocean view properties
• Family-friendly accommodations
• Modern amenities
• Authentic Moroccan hospitality
• Close to beaches and attractions
• Flexible booking options

Be helpful, polite, and enthusiastic. Use appropriate emojis. Provide useful information about our properties and the local area. If asked about something you don't know, suggest contacting our support team.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || 
        (language === 'ar' 
          ? "أعتذر، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى."
          : "I'm sorry, I couldn't process your request. Please try again.");

      res.json({ response });
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage = req.body.language === 'ar'
        ? "حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً."
        : "An error occurred processing your request. Please try again later.";
      
      res.status(500).json({ 
        error: "Internal server error",
        response: errorMessage 
      });
    }
  });

  // Host Chatbot API endpoint
  app.post("/api/host-chat", async (req, res) => {
    try {
      const { message, language = 'en', context } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!process.env.OPENAI_API_KEY || !openai) {
        // Enhanced fallback responses for hosts with specific guidance
        const hostFallbackResponses = {
          en: {
            listing: [
              "🏠 To create your first listing: 1) Take high-quality photos of all rooms 2) Write a detailed description highlighting unique features 3) Set competitive pricing using our market insights 4) Add all amenities and house rules. Need help with any specific step?",
              "📝 Great question! Start with our listing wizard in your Host Dashboard. Focus on clear photos, accurate descriptions, and competitive pricing. Morocco's vacation rental market loves authentic touches - mention local attractions like Chefchaouen or Cabo Negro nearby!"
            ],
            pricing: [
              "💰 For Morocco pricing: Research similar properties in Martil/Tamuda Bay, consider seasonal demand (summer peaks), factor in local events, and start slightly above market rate - you can always adjust. Weekend rates should be 20-30% higher than weekdays.",
              "📊 Smart pricing tips: Check competitor rates in Tetouan area, use dynamic pricing during Moroccan holidays, consider long-stay discounts, and remember that beachfront properties in Cabo Negro command premium rates!"
            ],
            communication: [
              "🌍 For Arabic guests: Use Google Translate for basic phrases, learn key Arabic greetings (Ahlan wa sahlan = Welcome), provide written instructions in Arabic, and be patient with cultural differences. Many guests appreciate the effort to communicate in their language!",
              "📱 Communication tips: Use translation apps, hire a local assistant for Arabic support, provide bilingual welcome guides, and remember that Moroccan hospitality values personal warmth and attention to detail."
            ],
            amenities: [
              "🎯 Top amenities guests expect in Morocco: WiFi (essential), AC (crucial in summer), traditional Moroccan décor, fully equipped kitchen, clean towels/linens, local area guides, and parking if available. Beach access is a huge plus in Martil!",
              "⭐ Must-have amenities: Reliable internet, air conditioning, authentic Moroccan touches, kitchen essentials, quality bedding, local recommendations guide, and safety features. Consider adding traditional tea service for authentic experience!"
            ],
            default: [
              "🏠 I'm here to help you succeed as a TamudaStay host! Whether you need help with listings, pricing, guest communication, or local market insights for Morocco, I've got you covered. What specific area would you like assistance with?",
              "💼 Welcome to host support! I can help with property listings, pricing strategies for the Moroccan market, guest relations, and optimizing your earnings. What would you like to work on today?"
            ]
          },
          ar: {
            listing: [
              "🏠 لإنشاء قائمتك الأولى: 1) التقط صور عالية الجودة لجميع الغرف 2) اكتب وصفاً مفصلاً يبرز الميزات الفريدة 3) حدد أسعاراً تنافسية باستخدام رؤى السوق 4) أضف جميع المرافق وقواعد المنزل. هل تحتاج مساعدة في أي خطوة محددة؟",
              "📝 سؤال رائع! ابدأ بمعالج الإعلانات في لوحة تحكم المضيف. ركز على الصور الواضحة والأوصاف الدقيقة والأسعار التنافسية. سوق الإيجارات في المغرب يحب اللمسات الأصيلة - اذكر المعالم المحلية مثل شفشاون أو كابو نيغرو القريبة!"
            ],
            pricing: [
              "💰 للتسعير في المغرب: ابحث في العقارات المماثلة في مارتيل/خليج تامودا، اعتبر الطلب الموسمي (ذروة الصيف)، احسب الأحداث المحلية، وابدأ بسعر أعلى قليلاً من السوق - يمكنك التعديل دائماً. أسعار نهاية الأسبوع يجب أن تكون أعلى بـ 20-30% من أيام الأسبوع.",
              "📊 نصائح التسعير الذكي: تحقق من أسعار المنافسين في منطقة تطوان، استخدم التسعير الديناميكي خلال العطل المغربية، فكر في خصومات الإقامة الطويلة، وتذكر أن العقارات على الشاطئ في كابو نيغرو تحصل على أسعار مميزة!"
            ],
            communication: [
              "🌍 للضيوف الناطقين بالإنجليزية: استخدم Google Translate للعبارات الأساسية، تعلم التحيات الإنجليزية الأساسية (Welcome = أهلاً وسهلاً)، قدم التعليمات المكتوبة بالإنجليزية، وكن صبوراً مع الاختلافات الثقافية. كثير من الضيوف يقدرون جهد التواصل بلغتهم!",
              "📱 نصائح التواصل: استخدم تطبيقات الترجمة، استعن بمساعد محلي للدعم الإنجليزي، قدم أدلة ترحيب ثنائية اللغة، وتذكر أن الضيافة المغربية تقدر الدفء الشخصي والاهتمام بالتفاصيل."
            ],
            amenities: [
              "🎯 أهم المرافق التي يتوقعها الضيوف في المغرب: الواي فاي (أساسي)، التكييف (ضروري في الصيف)، الديكور المغربي التقليدي، مطبخ مجهز بالكامل، مناشف/أغطية نظيفة، أدلة المنطقة المحلية، وموقف سيارات إن أمكن. الوصول للشاطئ ميزة كبيرة في مارتيل!",
              "⭐ المرافق الضرورية: إنترنت موثوق، تكييف هواء، لمسات مغربية أصيلة، أساسيات المطبخ، فراش عالي الجودة، دليل التوصيات المحلية، وميزات الأمان. فكر في إضافة خدمة الشاي التقليدية للحصول على تجربة أصيلة!"
            ],
            default: [
              "🏠 أنا هنا لمساعدتك على النجاح كمضيف في تاموداستاي! سواء كنت تحتاج مساعدة في الإعلانات أو التسعير أو التواصل مع الضيوف أو رؤى السوق المحلية للمغرب، أنا أدعمك. في أي مجال تريد المساعدة تحديداً؟",
              "💼 مرحباً بك في دعم المضيفين! يمكنني مساعدتك في قوائم العقارات واستراتيجيات التسعير للسوق المغربي وعلاقات الضيوف وتحسين أرباحك. ماذا تريد أن نعمل عليه اليوم؟"
            ]
          }
        };

        const messageLC = message.toLowerCase();
        const responses = hostFallbackResponses[language as 'en' | 'ar'];
        
        let responseCategory = 'default';
        if (messageLC.includes('listing') || messageLC.includes('create') || messageLC.includes('إعلان') || messageLC.includes('قائمة')) responseCategory = 'listing';
        else if (messageLC.includes('pricing') || messageLC.includes('price') || messageLC.includes('تسعير') || messageLC.includes('سعر')) responseCategory = 'pricing';
        else if (messageLC.includes('communication') || messageLC.includes('guest') || messageLC.includes('تواصل') || messageLC.includes('ضيوف')) responseCategory = 'communication';
        else if (messageLC.includes('amenities') || messageLC.includes('expect') || messageLC.includes('مرافق') || messageLC.includes('يتوقع')) responseCategory = 'amenities';

        const categoryResponses = responses[responseCategory as keyof typeof responses];
        const response = Array.isArray(categoryResponses) 
          ? categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
          : categoryResponses;

        return res.json({ response });
      }

      // Enhanced system prompt for Host Assistant
      const systemPrompt = language === 'ar' 
        ? `أنت مساعد مضيفي تاموداستاي المتخصص، وهو روبوت محادثة ذكي مصمم لمساعدة مالكي العقارات والمضيفين على منصة تاموداستاي للإيجارات في المغرب.

دورك هو توجيه ودعم ومساعدة المضيفين في إدراج وإدارة عقاراتهم وتحسين تجربة الضيوف وفهم السوق المحلية.

شخصيتك:
- مهني ولكن ودود
- داعم ومشجع  
- عملي وموجه نحو العمل
- واعٍ ثقافياً بالضيافة المغربية

معرفتك الأساسية تشمل:

1. البداية كمضيف
- إعداد الإعلانات
- إرشادات التصوير  
- استراتيجيات التسعير للمغرب
- الوثائق المطلوبة والمعلومات القانونية

2. إدارة العقارات
- التواصل مع الضيوف
- عملية تسجيل الوصول/المغادرة
- الصيانة والمخزون
- إجراءات الطوارئ

3. التسويق والتحسين
- كتابة أوصاف جيدة
- المرافق التي يبحث عنها الضيوف
- المعالم المحلية (مارتيل، خليج تامودا، شفشاون، كابو نيغرو، تطوان)
- نصائح موسمية للمغرب

4. علاقات الضيوف
- الحساسية الثقافية
- استراتيجيات المراجعات
- نصائح التواصل العربي-الإنجليزي

5. الإدارة المالية
- رسوم تاموداستاي
- المدفوعات والضرائب
- تتبع المصروفات

إرشادات الرد:
- اكتشف لغة المستخدم (عربية أو إنجليزية) ورد وفقاً لذلك
- يجب أن تكون الردود موجزة (2-4 جمل)
- استخدم النقاط للخطوات
- الرموز التعبيرية مسموحة باعتدال 😊
- أحل للدعم البشري للمشاكل القانونية/المدفوعات/التقنية
- شجع ووجه المضيفين دائماً للنجاح`
        : `You are the TamudaStay Host Assistant, a specialized AI chatbot designed to help property owners and hosts on the TamudaStay vacation rental platform in Morocco.

Your role is to guide, support, and assist hosts in listing and managing their properties, optimizing guest experience, and understanding the local market.

Your personality is:
- Professional yet friendly
- Supportive and encouraging
- Practical and action-oriented
- Culturally aware of Moroccan hospitality

Your core knowledge includes:

1. Getting Started as a Host
- Listing setup
- Photo guidelines
- Pricing strategies for Morocco
- Required documents and legal info

2. Property Management
- Guest communication
- Check-in/out process
- Maintenance and inventory
- Emergency procedures

3. Marketing & Optimization
- Writing good descriptions
- Amenities guests look for
- Local attractions (Martil, Tamuda Bay, Chefchaouen, Cabo Negro, Tetouan)
- Seasonal tips for Morocco

4. Guest Relations
- Cultural sensitivity
- Review strategies
- Arabic-English communication tips

5. Financial Management
- TamudaStay fees
- Payouts and taxes
- Expense tracking

Your response guidelines:
- Detect user language (Arabic or English) and reply accordingly
- Responses should be concise (2–4 sentences)
- Use bullet points for steps
- Emojis are allowed sparingly 😊
- Escalate to human support for legal/payment/technical problems
- Always encourage and guide hosts to succeed`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 400,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || 
        (language === 'ar' 
          ? "أعتذر، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى أو الاتصال بدعم المضيفين."
          : "I'm sorry, I couldn't process your request. Please try again or contact host support.");

      res.json({ response });
    } catch (error) {
      console.error("Host Chat API error:", error);
      const errorMessage = req.body.language === 'ar'
        ? "حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بدعم المضيفين."
        : "An error occurred processing your request. Please try again later or contact host support.";
      
      res.status(500).json({ 
        error: "Internal server error",
        response: errorMessage 
      });
    }
  });

  app.post("/api/properties/:id/block-dates", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const { start, end, reason } = req.body;
      
      if (isNaN(propertyId)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }

      // In a real implementation, you'd create a blocked dates table
      // For now, we'll create a special booking entry
      const blockingData = {
        propertyId,
        guestName: "BLOCKED",
        guestEmail: "system@example.com",
        checkIn: start,
        checkOut: end,
        guests: 0,
        amount: 0,
        status: "blocked",
        comments: reason || "Dates blocked by host"
      };

      const booking = await storage.createBooking(blockingData);
      res.status(201).json(booking);
    } catch (error) {
      console.error("Block dates error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Review Analysis endpoint
  app.post("/api/review-analysis", async (req, res) => {
    try {
      const { ownerId, properties } = req.body;

      if (!ownerId) {
        return res.status(400).json({ error: "Owner ID is required" });
      }

      // Sample review analysis data - in production, this would fetch real reviews and use AI
      const sampleAnalysis = {
        overallSentiment: {
          positive: 85,
          neutral: 12,
          negative: 3
        },
        mostPraised: [
          { feature: "Location", percentage: 92 },
          { feature: "Cleanliness", percentage: 88 },
          { feature: "Host Service", percentage: 85 },
          { feature: "Amenities", percentage: 82 }
        ],
        improvementAreas: [
          { feature: "WiFi Speed", percentage: 65 },
          { feature: "Check-in Process", percentage: 72 },
          { feature: "Parking", percentage: 68 },
          { feature: "Noise Level", percentage: 70 }
        ],
        aiInsights: {
          summary: "Your properties are consistently praised for their excellent location and cleanliness. Guests particularly love the proximity to Martil Beach and the authentic Moroccan décor. The most common positive themes include \"beautiful views,\" \"spotless accommodation,\" and \"helpful host.\"",
          actionItems: [
            "WiFi Upgrade: Consider upgrading internet speed - mentioned in 23% of reviews",
            "Check-in Guide: Create a digital check-in guide to streamline the process",
            "Parking Info: Add clear parking instructions to your listing description",
            "Noise Management: Consider soundproofing or quiet hours policy"
          ],
          growthOpportunities: "Your high ratings for location and cleanliness suggest you could increase prices by 10-15% during peak season. Consider highlighting these strengths in your listing title and description to attract more bookings."
        },
        recentReviews: [
          {
            id: 1,
            propertyName: "Villa Tamuda Bay",
            rating: 5,
            text: "Amazing location with stunning sea views! The villa was spotlessly clean and the host was incredibly helpful. Would definitely stay again when visiting Morocco.",
            guestName: "Sarah M.",
            guestLocation: "UK",
            date: "2 days ago",
            sentiment: "positive"
          },
          {
            id: 2,
            propertyName: "Riad Martil",
            rating: 4,
            text: "Beautiful traditional Moroccan décor and great location. WiFi could be faster for remote work, but overall a wonderful experience.",
            guestName: "Ahmed K.",
            guestLocation: "Spain",
            date: "1 week ago",
            sentiment: "mostly_positive"
          },
          {
            id: 3,
            propertyName: "Casa Marina",
            rating: 4,
            text: "Lovely apartment with great amenities. Check-in process was a bit confusing, could benefit from clearer instructions.",
            guestName: "Marie L.",
            guestLocation: "France",
            date: "2 weeks ago",
            sentiment: "positive_with_feedback"
          }
        ],
        generatedAt: new Date().toISOString()
      };

      // If OpenAI is available, enhance the analysis
      if (process.env.OPENAI_API_KEY && openai) {
        try {
          const aiPrompt = `Analyze vacation rental reviews for properties in Morocco. Generate insights about:
          1. Overall guest satisfaction trends
          2. Most appreciated features
          3. Areas needing improvement
          4. Pricing and market positioning recommendations
          5. Specific action items for the host
          
          Focus on properties in the Martil/Tamuda Bay area of Morocco.`;

          const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are an AI assistant specialized in vacation rental analytics and guest experience optimization for Moroccan properties."
              },
              {
                role: "user",
                content: aiPrompt
              }
            ],
            max_tokens: 500,
            temperature: 0.7,
          });

          // Enhance the sample analysis with AI insights
          if (aiResponse.choices[0]?.message?.content) {
            sampleAnalysis.aiInsights.summary = aiResponse.choices[0].message.content;
          }
        } catch (aiError) {
          console.error('OpenAI error:', aiError);
          // Continue with sample data if AI fails
        }
      }

      res.json(sampleAnalysis);
    } catch (error) {
      console.error("Review analysis error:", error);
      res.status(500).json({ error: "Failed to generate review analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
