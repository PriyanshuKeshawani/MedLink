const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  bloodGroup: String,
  allergies: [String],
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('PatientProfile', patientProfileSchema);
