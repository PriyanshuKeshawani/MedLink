const Appointment = require('../models/Appointment');
const DoctorProfile = require('../models/DoctorProfile');

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason, type } = req.body;
    const patientId = req.user.id; // From auth middleware

    // 1. Double-booking check
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      'timeSlot.start': timeSlot.start,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This slot is already booked. Please choose another.' });
    }

    // 2. Create appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      reason,
      type
    });

    // 3. Trigger Notification
    const notificationService = require('../services/notificationService');
    await notificationService.createNotification({
      recipient: doctorId,
      sender: patientId,
      type: 'appointment_booked',
      title: 'New Appointment',
      message: `You have a new appointment request for ${date} at ${timeSlot.start}.`,
      data: { appointmentId: appointment._id }
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'firstName lastName email')
      .sort({ date: 1 });

    const enrichedAppointments = await Promise.all(appointments.map(async (appt) => {
      if (appt.doctor) {
        const profile = await DoctorProfile.findOne({ user: appt.doctor._id });
        const doctorObj = { ...appt.doctor._doc, profile };
        const apptObj = appt.toObject();
        apptObj.doctor = doctorObj;
        return apptObj;
      }
      return appt;
    }));

    res.json(enrichedAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    console.log('[getDoctorAppointments] Doctor req.user:', req.user);
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctors only.' });
    }
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'firstName lastName email')
      .sort({ date: 1, 'timeSlot.start': 1 });
    console.log('[getDoctorAppointments] Found appointments count:', appointments.length);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient._id.toString() !== req.user.id && appointment.doctor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You are not authorized.' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Unauthorized.' });
    }

    appointment.status = status;
    await appointment.save();

    if (status === 'cancelled') {
      const recipientId = req.user.role === 'doctor' ? appointment.patient : appointment.doctor;
      const notificationService = require('../services/notificationService');
      await notificationService.createNotification({
        recipient: recipientId,
        sender: req.user.id,
        type: 'appointment_cancelled',
        title: 'Appointment Cancelled',
        message: `The appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} has been cancelled by the ${req.user.role}.`,
        data: { appointmentId: appointment._id }
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createAppointment, 
  getPatientAppointments, 
  getDoctorAppointments, 
  getAppointmentById,
  updateAppointmentStatus
};
