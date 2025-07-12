import { User, Property, Booking, Notification, Message, IUser, IProperty, IBooking, INotification, IMessage } from '../models';
import mongoose from 'mongoose';

export class MongoStorage {
  // ==================== USER METHODS ====================
  
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async getUserById(id: string): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await User.findById(id);
  }

  async getUser(id: string): Promise<IUser | null> {
    return await this.getUserById(id);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async getUsersByRole(role: string): Promise<IUser[]> {
    return await User.find({ role });
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find().sort({ createdAt: -1 });
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  // ==================== PROPERTY METHODS ====================
  
  async createProperty(propertyData: Partial<IProperty>): Promise<IProperty> {
    const property = new Property(propertyData);
    return await property.save();
  }

  async getPropertyById(id: string): Promise<IProperty | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Property.findById(id).populate('ownerId hostId', 'name email');
  }

  async getProperty(id: string): Promise<IProperty | null> {
    return await this.getPropertyById(id);
  }

  async getAllProperties(): Promise<IProperty[]> {
    return await Property.find().populate('ownerId hostId', 'name email').sort({ createdAt: -1 });
  }

  async getPublicProperties(): Promise<IProperty[]> {
    return await Property.find({
      status: 'approved',
      isActive: true,
      isVisible: true
    }).populate('hostId', 'name').sort({ featured: -1, rating: -1, createdAt: -1 });
  }

  async getPropertiesByOwner(ownerId: string): Promise<IProperty[]> {
    if (!mongoose.Types.ObjectId.isValid(ownerId)) return [];
    return await Property.find({ ownerId }).populate('hostId', 'name email').sort({ createdAt: -1 });
  }

  async getPropertiesByHost(hostId: string): Promise<IProperty[]> {
    if (!mongoose.Types.ObjectId.isValid(hostId)) return [];
    return await Property.find({ hostId }).populate('ownerId', 'name email').sort({ createdAt: -1 });
  }

  async getPendingProperties(): Promise<IProperty[]> {
    return await Property.find({ status: 'pending' }).populate('ownerId hostId', 'name email').sort({ createdAt: -1 });
  }

  async getPropertiesByStatus(status: string): Promise<IProperty[]> {
    return await Property.find({ status }).populate('ownerId hostId', 'name email').sort({ createdAt: -1 });
  }

  async updateProperty(id: string, updates: Partial<IProperty>): Promise<IProperty | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Property.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteProperty(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Property.findByIdAndDelete(id);
    return !!result;
  }

  async approveProperty(id: string, reviewedBy: string): Promise<IProperty | null> {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewedBy)) return null;
    return await Property.findByIdAndUpdate(id, {
      status: 'approved',
      isActive: true,
      isVisible: true,
      approvedAt: new Date(),
      reviewedAt: new Date(),
      reviewedBy: new mongoose.Types.ObjectId(reviewedBy)
    }, { new: true });
  }

  async rejectProperty(id: string, rejectionReason: string, reviewedBy: string): Promise<IProperty | null> {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewedBy)) return null;
    return await Property.findByIdAndUpdate(id, {
      status: 'rejected',
      isActive: false,
      isVisible: false,
      rejectionReason,
      reviewedAt: new Date(),
      reviewedBy: new mongoose.Types.ObjectId(reviewedBy)
    }, { new: true });
  }

  // ==================== BOOKING METHODS ====================
  
  async createBooking(bookingData: Partial<IBooking>): Promise<IBooking> {
    const booking = new Booking(bookingData);
    return await booking.save();
  }

  async getBookingById(id: string): Promise<IBooking | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Booking.findById(id).populate('propertyId userId', 'title name email');
  }

  async getAllBookings(): Promise<IBooking[]> {
    return await Booking.find().populate('propertyId userId', 'title name email').sort({ createdAt: -1 });
  }

  async getBookingsByUser(userId: string): Promise<IBooking[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    return await Booking.find({ userId }).populate('propertyId', 'title location images').sort({ createdAt: -1 });
  }

  async getBookingsByProperty(propertyId: string): Promise<IBooking[]> {
    if (!mongoose.Types.ObjectId.isValid(propertyId)) return [];
    return await Booking.find({ propertyId }).populate('userId', 'name email').sort({ createdAt: -1 });
  }

  async updateBooking(id: string, updates: Partial<IBooking>): Promise<IBooking | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Booking.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteBooking(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Booking.findByIdAndDelete(id);
    return !!result;
  }

  // Booking availability methods
  async checkBookingAvailability(propertyId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
    try {
      const conflictingBooking = await Booking.findOne({
        propertyId: new mongoose.Types.ObjectId(propertyId),
        $or: [
          {
            checkIn: { $lt: checkOut },
            checkOut: { $gt: checkIn }
          }
        ],
        status: { $ne: 'cancelled' }
      });
      
      return !conflictingBooking;
    } catch (error) {
      console.error('Error checking booking availability:', error);
      throw error;
    }
  }

  async getBookedDatesForProperty(propertyId: string): Promise<{ checkIn: Date, checkOut: Date }[]> {
    try {
      const bookings = await Booking.find({
        propertyId: new mongoose.Types.ObjectId(propertyId),
        status: { $ne: 'cancelled' }
      }).select('checkIn checkOut');
      
      return bookings.map(booking => ({
        checkIn: booking.checkIn,
        checkOut: booking.checkOut
      }));
    } catch (error) {
      console.error('Error getting booked dates:', error);
      throw error;
    }
  }

  // ==================== NOTIFICATION METHODS ====================
  
  async createNotification(notificationData: Partial<INotification>): Promise<INotification> {
    const notification = new Notification(notificationData);
    return await notification.save();
  }

  async getNotificationsByUser(userId: string): Promise<INotification[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    return await Notification.find({ userId }).sort({ createdAt: -1 });
  }

  async markNotificationAsRead(id: string): Promise<INotification | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
  }

  async deleteNotification(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Notification.findByIdAndDelete(id);
    return !!result;
  }

  // ==================== MESSAGE METHODS ====================
  
  async createMessage(messageData: Partial<IMessage>): Promise<IMessage> {
    const message = new Message(messageData);
    return await message.save();
  }

  async getMessageById(id: string): Promise<IMessage | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Message.findById(id).populate('assignedTo propertyId', 'name title');
  }

  async getAllMessages(): Promise<IMessage[]> {
    return await Message.find().populate('assignedTo propertyId', 'name title').sort({ createdAt: -1 });
  }

  async updateMessage(id: string, updates: Partial<IMessage>): Promise<IMessage | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Message.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteMessage(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Message.findByIdAndDelete(id);
    return !!result;
  }

  // ==================== UTILITY METHODS ====================
  
  async seedDatabase(): Promise<void> {
    try {
      // Check if users already exist
      const userCount = await User.countDocuments();
      if (userCount > 0) {
        console.log('Database already seeded, skipping...');
        return;
      }

      console.log('Seeding database with initial data...');

      // Create admin user
      const adminUser = new User({
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        name: 'System Administrator',
        email: 'admin@tamudarental.com',
        role: 'admin',
        status: 'active'
      });
      await adminUser.save();

      // Create host user
      const hostUser = new User({
        username: 'host1',
        password: 'host123', // In production, this should be hashed
        name: 'Ahmed Hassan',
        email: 'host@tamudarental.com',
        role: 'host',
        status: 'active'
      });
      await hostUser.save();

      // Create sample property
      const sampleProperty = new Property({
        title: 'Luxury Beachfront Villa in Tamuda',
        description: 'Experience the ultimate luxury in this stunning beachfront villa with panoramic ocean views.',
        price: 250,
        priceUnit: 'night',
        images: ['/images/property1-1.jpg', '/images/property1-2.jpg'],
        location: 'Tamuda Bay, Morocco',
        bedrooms: 4,
        bathrooms: 3,
        capacity: 8,
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Kitchen', 'Parking'],
        featured: true,
        rating: 4.8,
        reviewCount: 24,
        ownerId: hostUser._id,
        hostId: hostUser._id,
        status: 'approved',
        isActive: true,
        isVisible: true,
        approvedAt: new Date(),
        rules: 'No smoking, No pets, Quiet hours: 10 PM - 8 AM'
      });
      await sampleProperty.save();

      console.log('✅ Database seeded successfully');
    } catch (error) {
      console.error('❌ Error seeding database:', error);
    }
  }
}

export const mongoStorage = new MongoStorage();
