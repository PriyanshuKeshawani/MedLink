const Appointment = require('../models/Appointment');

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
      .populate('doctor', 'firstName lastName')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAppointment, getPatientAppointments };
