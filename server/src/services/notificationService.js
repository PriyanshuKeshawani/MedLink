const Notification = require('../models/Notification');
const { getIO, getUserSocket } = require('../config/socket');

class NotificationService {
  async createNotification({ recipient, sender, type, title, message, data }) {
    try {
      // 1. Persist to DB
      const notification = await Notification.create({
        recipient,
        sender,
        type,
        title,
        message,
        data,
      });

      // 2. Emit via Socket.io
      const io = getIO();
      const socketId = getUserSocket(recipient.toString());

      if (socketId) {
        io.to(socketId).emit('new_notification', notification);
      }

      return notification;
    } catch (error) {
      console.error('Notification Service Error:', error);
      // We don't throw here to avoid breaking the main request flow
    }
  }

  async getNotifications(userId) {
    return await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  }
}

module.exports = new NotificationService();
