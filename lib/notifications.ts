import Notification from '@/models/Notification';
import mongoose from 'mongoose';

export async function createNotification({
  recipientId,
  recipientType,
  title,
  message,
  type,
  link
}: {
  recipientId: string | mongoose.Types.ObjectId;
  recipientType: 'vendor' | 'admin' | 'user';
  title: string;
  message: string;
  type: 'order' | 'payment' | 'stock' | 'system';
  link?: string;
}) {
  try {
    const notification = new Notification({
      recipientId,
      recipientType,
      title,
      message,
      type,
      link
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}
