import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'property_review' | 'property_approved' | 'property_rejected' | 'property_submitted' | 'booking_confirmed' | 'booking_cancelled';
  title: string;
  message: string;
  propertyId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['property_review', 'property_approved', 'property_rejected', 'property_submitted', 'booking_confirmed', 'booking_cancelled']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: false
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: false
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
