const mongoose = require('mongoose');

const doctorLeaveSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: String,
  type: {
    type: String,
    enum: ['vacation', 'emergency', 'sick-leave', 'other'],
    default: 'other',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('DoctorLeave', doctorLeaveSchema);
