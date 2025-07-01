import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPropertySchema, insertBookingSchema, insertMessageSchema, insertAuditLogSchema } from "@shared/schema";
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
      
      // Check if this is an authenticated user booking
      if (bookingData.userId) {
        // Use createOrUpdateBooking for authenticated users
        const booking = await storage.createOrUpdateBooking(bookingData);
        res.status(201).json(booking);
      } else {
        // For guest bookings, always create new
        const booking = await storage.createBooking(bookingData);
        res.status(201).json(booking);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      if (error instanceof Error && error.message.includes('not available')) {
        return res.status(409).json({ error: error.message });
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

  const httpServer = createServer(app);
  return httpServer;
}
