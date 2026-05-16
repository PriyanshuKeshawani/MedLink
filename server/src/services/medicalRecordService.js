const MedicalRecord = require('../models/MedicalRecord');

class MedicalRecordService {
  async createRecord(recordData) {
    try {
      const record = await MedicalRecord.create(recordData);
      return await record.populate([
        { path: 'doctor', select: 'firstName lastName specialization' },
        { path: 'patient', select: 'firstName lastName email' }
      ]);
    } catch (error) {
      throw new Error(`Error creating medical record: ${error.message}`);
    }
  }

  async getPatientHistory(patientId) {
    try {
      return await MedicalRecord.find({ patient: patientId })
        .populate('doctor', 'firstName lastName specialization')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching patient history: ${error.message}`);
    }
  }

  async getRecordById(recordId) {
    try {
      return await MedicalRecord.findById(recordId)
        .populate('doctor', 'firstName lastName specialization')
        .populate('patient', 'firstName lastName email');
    } catch (error) {
      throw new Error(`Error fetching record: ${error.message}`);
    }
  }

  async updateRecord(recordId, updateData) {
    try {
      return await MedicalRecord.findByIdAndUpdate(recordId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Error updating record: ${error.message}`);
    }
  }
}

module.exports = new MedicalRecordService();
