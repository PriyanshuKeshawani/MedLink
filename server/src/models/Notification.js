const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['appointment_booked', 'appointment_cancelled', 'appointment_confirmed', 'message', 'other'],
    required: true,
  },
  title: String,
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object, // Extra data like appointmentId
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);
