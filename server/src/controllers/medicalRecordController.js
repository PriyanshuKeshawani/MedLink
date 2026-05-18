const medicalRecordService = require('../services/medicalRecordService');

const createMedicalRecord = async (req, res) => {
  try {
    // Only doctors can create records
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create medical records' });
    }

    const record = await medicalRecordService.createRecord({
      ...req.body,
      doctor: req.user.id
    });

    // Mark appointment as completed
    if (req.body.appointment) {
      const Appointment = require('../models/Appointment');
      await Appointment.findByIdAndUpdate(req.body.appointment, { status: 'completed' });
    }

    // Trigger Notification to the patient
    const notificationService = require('../services/notificationService');
    await notificationService.createNotification({
      recipient: req.body.patient,
      sender: req.user.id,
      type: 'appointment_completed',
      title: 'Consultation Completed',
      message: `Your clinical summary and prescription from Dr. ${req.user.firstName} ${req.user.lastName} are now available.`,
      data: { recordId: record._id }
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyHistory = async (req, res) => {
  try {
    const history = await medicalRecordService.getPatientHistory(req.user.id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatientHistoryForDoctor = async (req, res) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const history = await medicalRecordService.getPatientHistory(req.params.patientId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecordDetails = async (req, res) => {
  try {
    const record = await medicalRecordService.getRecordById(req.params.id);
    
    // Authorization check: User must be the patient or the doctor
    if (record.patient._id.toString() !== req.user.id && record.doctor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this record' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMedicalRecord,
  getMyHistory,
  getPatientHistoryForDoctor,
  getRecordDetails
};
