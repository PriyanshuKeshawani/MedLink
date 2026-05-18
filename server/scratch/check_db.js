require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Appointment = require('../src/models/Appointment');

const checkDb = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const users = await User.find({});
  console.log('--- USERS ---');
  users.forEach(u => console.log(`${u._id} - ${u.email} - ${u.role}`));

  const appts = await Appointment.find({});
  console.log('--- APPOINTMENTS ---');
  appts.forEach(a => console.log(`ID: ${a._id} | Patient: ${a.patient} | Doctor: ${a.doctor} | Date: ${a.date} | Status: ${a.status}`));

  process.exit(0);
};

checkDb();
