const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');

const getDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    let query = { role: 'doctor' };

    if (specialization) {
      // Find doctor profiles with specialization
      const profiles = await DoctorProfile.find({ 
        specialization: new RegExp(specialization, 'i') 
      });
      const doctorIds = profiles.map(p => p.user);
      query._id = { $in: doctorIds };
    }

    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
      ];
    }

    const doctors = await User.find(query).select('-password -refreshToken');
    
    // Enrich doctors with their profiles
    const enrichedDoctors = await Promise.all(doctors.map(async (doc) => {
      const profile = await DoctorProfile.findOne({ user: doc._id });
      return { ...doc._doc, profile };
    }));

    res.json(enrichedDoctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const profile = await DoctorProfile.findOne({ user: doctor._id });
    res.json({ ...doctor._doc, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const availabilityService = require('../services/availabilityService');

const getDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // Date string (YYYY-MM-DD)
    
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const slots = await availabilityService.getAvailableSlots(id, date);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getDoctorById, getDoctorAvailability };
