const express = require('express');
const { 
  createAppointment, 
  getPatientAppointments, 
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all appointment routes

router.post('/', createAppointment);
router.get('/my-appointments', getPatientAppointments);
router.get('/doctor-appointments', getDoctorAppointments);
router.get('/:id', getAppointmentById);
router.patch('/:id/status', updateAppointmentStatus);

module.exports = router;
