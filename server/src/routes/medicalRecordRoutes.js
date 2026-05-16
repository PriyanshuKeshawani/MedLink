const express = require('express');
const { 
  createMedicalRecord, 
  getMyHistory, 
  getPatientHistoryForDoctor, 
  getRecordDetails 
} = require('../controllers/medicalRecordController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createMedicalRecord);
router.get('/my-history', getMyHistory);
router.get('/patient/:patientId', getPatientHistoryForDoctor);
router.get('/:id', getRecordDetails);

module.exports = router;
