const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualifications: [String],
  experience: Number, // in years
  bio: String,
  consultationFee: Number,
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    slots: [{
      start: String, // e.g., "09:00"
      end: String,   // e.g., "10:00"
    }]
  }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
