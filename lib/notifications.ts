import Notification from '@/models/Notification';
import Admin from '@/models/Admin';
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

export async function notifyAdmins({
  title,
  message,
  type,
  link
}: {
  title: string;
  message: string;
  type: 'order' | 'payment' | 'stock' | 'system';
  link?: string;
}) {
  try {
    const admins = await Admin.find({});
    const notifications = admins.map(admin => ({
      recipientId: admin._id,
      recipientType: 'admin',
      title,
      message,
      type,
      link
    }));
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error('Failed to notify admins:', error);
  }
}
