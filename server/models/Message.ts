import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: mongoose.Types.ObjectId;
  propertyId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    default: 'new',
    enum: ['new', 'read', 'replied', 'closed']
  },
  priority: {
    type: String,
    required: true,
    default: 'medium',
    enum: ['low', 'medium', 'high']
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
messageSchema.index({ status: 1 });
messageSchema.index({ priority: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ assignedTo: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
