const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const DoctorLeave = require('../models/DoctorLeave');
const DoctorProfile = require('../models/DoctorProfile');

dayjs.extend(utc);
dayjs.extend(timezone);

class AvailabilityService {
  async getAvailableSlots(doctorId, date) {
    const profile = await DoctorProfile.findOne({ user: doctorId });
    if (!profile) throw new Error('Doctor profile not found');

    const targetDate = dayjs(date).startOf('day');
    const dayOfWeek = targetDate.format('Wednesday'); // Actually I should get the day name correctly
    const dayName = targetDate.format('dddd');

    // 1. Check for Leave
    const isOnLeave = await DoctorLeave.findOne({
      doctor: doctorId,
      startDate: { $lte: targetDate.toDate() },
      endDate: { $gte: targetDate.toDate() }
    });

    if (isOnLeave) return [];

    // 2. Get Recurring Schedule
    const schedule = await Availability.find({
      doctor: doctorId,
      dayOfWeek: dayName,
      isActive: true
    });

    if (schedule.length === 0) return [];

    // 3. Get Existing Appointments
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: targetDate.toDate(),
        $lt: targetDate.add(1, 'day').toDate()
      },
      status: { $nin: ['cancelled', 'no-show'] }
    });

    const slots = [];
    const duration = profile.consultationDuration || 30;
    const buffer = profile.bufferTime || 5;

    for (const period of schedule) {
      let currentSlotStart = targetDate
        .set('hour', parseInt(period.startTime.split(':')[0]))
        .set('minute', parseInt(period.startTime.split(':')[1]));
      
      const periodEnd = targetDate
        .set('hour', parseInt(period.endTime.split(':')[0]))
        .set('minute', parseInt(period.endTime.split(':')[1]));

      while (currentSlotStart.add(duration, 'minute').isBefore(periodEnd) || currentSlotStart.add(duration, 'minute').isSame(periodEnd)) {
        const slotEnd = currentSlotStart.add(duration, 'minute');
        
        // Check for overlaps
        const isOverlapping = existingAppointments.some(app => {
          const appStart = dayjs(app.date).set('hour', parseInt(app.timeSlot.start.split(':')[0])).set('minute', parseInt(app.timeSlot.start.split(':')[1]));
          const appEnd = dayjs(app.date).set('hour', parseInt(app.timeSlot.end.split(':')[0])).set('minute', parseInt(app.timeSlot.end.split(':')[1]));
          
          return (currentSlotStart.isBefore(appEnd) && slotEnd.isAfter(appStart));
        });

        if (!isOverlapping) {
          slots.push({
            start: currentSlotStart.format('HH:mm'),
            end: slotEnd.format('HH:mm')
          });
        }

        currentSlotStart = slotEnd.add(buffer, 'minute');
      }
    }

    return slots;
  }
}

module.exports = new AvailabilityService();
