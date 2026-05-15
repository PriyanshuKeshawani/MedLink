const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['online', 'home-visit'],
    default: 'online',
  },
  reason: String,
  notes: String,
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
  meetingLink: String, // For online consultations
}, {
  timestamps: true,
});

// Index for preventing double booking
appointmentSchema.index({ doctor: 1, date: 1, 'timeSlot.start': 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
