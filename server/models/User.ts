import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  email?: string;
  name: string;
  role: 'user' | 'host' | 'admin' | 'staff';
  status: 'active' | 'inactive';
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'host', 'admin', 'staff']
  },
  status: {
    type: String,
    required: true,
    default: 'active',
    enum: ['active', 'inactive']
  },
  phone: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true // This creates createdAt and updatedAt automatically
});

// Indexes for better performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
