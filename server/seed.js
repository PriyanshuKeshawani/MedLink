require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const DoctorProfile = require('./src/models/DoctorProfile');

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB for seeding...');

    // Clear existing doctors
    await User.deleteMany({ role: 'doctor' });
    await DoctorProfile.deleteMany({});

    const doctorsData = [
      {
        firstName: 'Sarah',
        lastName: 'Mitchell',
        email: 'sarah@medlink.com',
        password: 'password123',
        role: 'doctor',
        profile: {
          specialization: 'Cardiology',
          experience: 15,
          ratings: { average: 4.9 },
          bio: 'Top cardiologist with expertise in heart surgery.'
        }
      },
      {
        firstName: 'David',
        lastName: 'Chen',
        email: 'david@medlink.com',
        password: 'password123',
        role: 'doctor',
        profile: {
          specialization: 'Dermatology',
          experience: 8,
          ratings: { average: 4.7 },
          bio: 'Skin specialist with a focus on cosmetic treatments.'
        }
      },
      {
        firstName: 'Elena',
        lastName: 'Rodriguez',
        email: 'elena@medlink.com',
        password: 'password123',
        role: 'doctor',
        profile: {
          specialization: 'Neurology',
          experience: 12,
          ratings: { average: 4.8 },
          bio: 'Neurologist specializing in brain health and recovery.'
        }
      }
    ];

    const Availability = require('./src/models/Availability');
    await Availability.deleteMany({});

    for (const data of doctorsData) {
      const user = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role
      });

      await DoctorProfile.create({
        user: user._id,
        timezone: 'Asia/Kolkata',
        consultationDuration: 30,
        bufferTime: 5,
        ...data.profile
      });

      // Add weekly availability for each doctor (Mon-Fri, 9 AM - 5 PM)
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      for (const day of days) {
        await Availability.create({
          doctor: user._id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00'
        });
      }
    }

    // Ensure test users exist
    let doctor = await User.findOne({ email: 'doctor@test.com' });
    if (!doctor) {
      doctor = await User.create({
        firstName: 'Sarah',
        lastName: 'Mitchell',
        email: 'doctor@test.com',
        password: 'password123',
        role: 'doctor'
      });
      await DoctorProfile.create({
        user: doctor._id,
        specialization: 'Cardiology',
        experience: 15,
        timezone: 'Asia/Kolkata',
        consultationDuration: 30,
        bufferTime: 5
      });
    }

    let patient = await User.findOne({ email: 'patient@test.com' });
    if (!patient) {
      patient = await User.create({
        firstName: 'Test',
        lastName: 'Patient',
        email: 'patient@test.com',
        password: 'password123',
        role: 'patient'
      });
    }

    // Seed Medical Records for the patient
    const MedicalRecord = require('./src/models/MedicalRecord');
    await MedicalRecord.deleteMany({});
    await MedicalRecord.create([
      {
        patient: patient._id,
        doctor: doctor._id,
        type: 'consultation',
        title: 'Initial Consultation',
        clinicalNotes: {
          chiefComplaint: 'Mild chest pain and fatigue',
          symptoms: ['Fatigue', 'Occasional dizziness'],
          diagnosis: 'General stress and lack of sleep',
          vitals: { bloodPressure: '120/80', heartRate: 72, temperature: 98.6, weight: 70 },
          notes: 'Patient advised to rest and monitor symptoms.'
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patient._id,
        doctor: doctor._id,
        type: 'prescription',
        title: 'Medication Update',
        prescriptions: [
          { medicineName: 'Vitamin B12', dosage: '500mcg', frequency: 'Once daily', duration: '1 month', instructions: 'Morning after breakfast' }
        ],
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('Database Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDoctors();
