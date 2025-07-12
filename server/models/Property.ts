import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  priceUnit: 'night' | 'week' | 'month';
  images: string[];
  location: string;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  amenities: string[];
  featured: boolean;
  rating: number;
  reviewCount: number;
  ownerId: mongoose.Types.ObjectId;
  hostId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  isActive: boolean;
  isVisible: boolean;
  approvedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  rules?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceUnit: {
    type: String,
    required: true,
    default: 'night',
    enum: ['night', 'week', 'month']
  },
  images: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: true,
    trim: true
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected', 'draft']
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  approvedAt: {
    type: Date,
    required: false
  },
  reviewedAt: {
    type: Date,
    required: false
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  rejectionReason: {
    type: String,
    required: false,
    trim: true
  },
  rules: {
    type: String,
    required: false,
    trim: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
propertySchema.index({ status: 1 });
propertySchema.index({ featured: 1 });
propertySchema.index({ ownerId: 1 });
propertySchema.index({ hostId: 1 });
propertySchema.index({ location: 1 });
propertySchema.index({ isActive: 1, isVisible: 1 });
propertySchema.index({ status: 1, featured: 1 });

export const Property = mongoose.model<IProperty>('Property', propertySchema);
