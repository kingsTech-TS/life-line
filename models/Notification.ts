import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  recipientType: 'vendor' | 'admin' | 'user';
  title: string;
  message: string;
  type: 'order' | 'payment' | 'stock' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipientId: { type: Schema.Types.ObjectId, required: true, refPath: 'recipientType' },
    recipientType: { type: String, required: true, enum: ['vendor', 'admin', 'user'] },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true, enum: ['order', 'payment', 'stock', 'system'] },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
