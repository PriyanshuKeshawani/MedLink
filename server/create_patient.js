const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

async function createPatient() {
  await mongoose.connect(process.env.MONGODB_URI);
  const patient = await User.create({
    firstName: 'Test',
    lastName: 'Patient',
    email: 'patient@test.com',
    password: 'password123',
    role: 'patient'
  });
  console.log('Patient created:', patient.email);
  process.exit();
}

createPatient();
