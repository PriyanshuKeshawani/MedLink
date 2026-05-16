const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  type: {
    type: String,
    enum: ['consultation', 'lab_result', 'prescription', 'vaccination', 'surgery'],
    default: 'consultation',
  },
  title: {
    type: String,
    required: true, // e.g., "General Follow-up", "Cardiology Report"
  },
  clinicalNotes: {
    chiefComplaint: String,
    symptoms: [String],
    diagnosis: String,
    vitals: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      weight: Number,
    },
    notes: String,
  },
  prescriptions: [{
    medicineName: String,
    dosage: String, // e.g., "500mg"
    frequency: String, // e.g., "Twice a day"
    duration: String, // e.g., "5 days"
    instructions: String, // e.g., "After food"
  }],
  labResults: [{
    testName: String,
    result: String,
    unit: String,
    normalRange: String,
    status: {
      type: String,
      enum: ['normal', 'abnormal', 'critical'],
    }
  }],
  attachments: [{
    name: String,
    url: String,
    fileType: String,
  }],
  followUpDate: Date,
}, {
  timestamps: true,
});

// Indexing for fast timeline retrieval
medicalRecordSchema.index({ patient: 1, createdAt: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
