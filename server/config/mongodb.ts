import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booking_site';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      // Mongoose 6+ doesn't need these options, but we'll keep them for compatibility
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default mongoose;
