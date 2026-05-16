const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');
const axios = require('axios');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const doctor = await User.findOne({ role: 'doctor' });
  if (!doctor) {
    console.log('No doctor found');
    process.exit(1);
  }
  console.log('Testing availability for doctor:', doctor.firstName, doctor._id);
  
  try {
    const res = await axios.get(`http://localhost:5000/api/doctors/${doctor._id}/availability?date=2026-05-20`); // A Wednesday
    console.log('Available slots:', res.data);
  } catch (err) {
    console.error('Test failed:', err.response?.data || err.message);
  }
  process.exit();
}

test();
