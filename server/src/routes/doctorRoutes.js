const express = require('express');
const { getDoctors, getDoctorById, getDoctorAvailability } = require('../controllers/doctorController');

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);

module.exports = router;
