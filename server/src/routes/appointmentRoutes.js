const express = require('express');
const { createAppointment, getPatientAppointments } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all appointment routes

router.post('/', createAppointment);
router.get('/my-appointments', getPatientAppointments);

module.exports = router;
