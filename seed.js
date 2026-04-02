const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

dotenv.config();

const doctors = [
  {
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@apollohospitals.com',
    specialization: 'Cardiology',
    hospital: 'Apollo Hospitals',
    country: 'India',
    city: 'Chennai',
    experience: 18,
    qualifications: ['MBBS', 'MD (Cardiology)', 'DM (Cardiology)', 'FACC'],
    languages: ['English', 'Hindi', 'Tamil'],
    consultationFee: 80,
    currency: 'USD',
    rating: 4.9,
    totalReviews: 234,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    bio: 'Dr. Rajesh Kumar is a leading cardiologist with 18+ years of experience in interventional cardiology, heart failure management, and cardiac surgery.',
  },
  {
    firstName: 'Priya',
    lastName: 'Menon',
    email: 'priya.menon@fortishealthcare.com',
    specialization: 'Orthopedics',
    hospital: 'Fortis Healthcare',
    country: 'India',
    city: 'Mumbai',
    experience: 14,
    qualifications: ['MBBS', 'MS (Orthopedics)', 'DNB', 'FRCS'],
    languages: ['English', 'Hindi', 'Malayalam'],
    consultationFee: 70,
    currency: 'USD',
    rating: 4.8,
    totalReviews: 189,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableTimeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    bio: 'Dr. Priya Menon specializes in joint replacement surgery, sports medicine, and minimally invasive orthopedic procedures.',
  },
  {
    firstName: 'Suresh',
    lastName: 'Nair',
    email: 'suresh.nair@medicity.com',
    specialization: 'Oncology',
    hospital: 'Medicity Hospital',
    country: 'India',
    city: 'Hyderabad',
    experience: 22,
    qualifications: ['MBBS', 'MD (Oncology)', 'DM', 'ESMO Certification'],
    languages: ['English', 'Hindi', 'Telugu'],
    consultationFee: 100,
    currency: 'USD',
    rating: 4.9,
    totalReviews: 312,
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['10:00', '11:00', '14:00', '15:00', '16:00'],
    bio: 'Dr. Suresh Nair is a renowned oncologist specializing in medical oncology, immunotherapy, and precision medicine for various cancers.',
  },
  {
    firstName: 'Amara',
    lastName: 'Ibrahim',
    email: 'amara.ibrahim@bangkokhospital.com',
    specialization: 'Neurology',
    hospital: 'Bangkok Hospital',
    country: 'Thailand',
    city: 'Bangkok',
    experience: 16,
    qualifications: ['MD', 'PhD (Neuroscience)', 'Board Certified Neurologist'],
    languages: ['English', 'Thai', 'Arabic'],
    consultationFee: 90,
    currency: 'USD',
    rating: 4.7,
    totalReviews: 156,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    availableTimeSlots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
    bio: 'Dr. Amara Ibrahim is an expert in neurological disorders, epilepsy, and advanced brain imaging diagnostics.',
  },
  {
    firstName: 'Hassan',
    lastName: 'Al-Farsi',
    email: 'hassan.alfarsi@bumrungrad.com',
    specialization: 'Cardiovascular Surgery',
    hospital: 'Bumrungrad International Hospital',
    country: 'Thailand',
    city: 'Bangkok',
    experience: 25,
    qualifications: ['MBBS', 'MCh (Cardiovascular Surgery)', 'FRCS (Edinburgh)'],
    languages: ['English', 'Arabic', 'Thai'],
    consultationFee: 150,
    currency: 'USD',
    rating: 5.0,
    totalReviews: 421,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['08:00', '09:00', '14:00', '15:00'],
    bio: 'Dr. Hassan Al-Farsi is one of Southeast Asia\'s most respected cardiovascular surgeons with 25+ years performing complex open-heart surgeries.',
  },
  {
    firstName: 'Sarah',
    lastName: 'Kim',
    email: 'sarah.kim@seoul-national.com',
    specialization: 'Dermatology & Cosmetic Surgery',
    hospital: 'Seoul National University Hospital',
    country: 'South Korea',
    city: 'Seoul',
    experience: 12,
    qualifications: ['MD', 'Board Certified Dermatologist', 'ASDS Member'],
    languages: ['English', 'Korean', 'Japanese'],
    consultationFee: 120,
    currency: 'USD',
    rating: 4.8,
    totalReviews: 278,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableTimeSlots: ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
    bio: 'Dr. Sarah Kim is a leading dermatologist specializing in advanced cosmetic procedures, skin rejuvenation, and laser treatments.',
  },
  {
    firstName: 'Michael',
    lastName: 'Tan',
    email: 'michael.tan@gleneagles.com',
    specialization: 'Gastroenterology',
    hospital: 'Gleneagles Hospital',
    country: 'Singapore',
    city: 'Singapore',
    experience: 19,
    qualifications: ['MBBS', 'MRCP', 'FRCP', 'Fellowship in Gastroenterology'],
    languages: ['English', 'Mandarin', 'Malay'],
    consultationFee: 110,
    currency: 'USD',
    rating: 4.6,
    totalReviews: 198,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    bio: 'Dr. Michael Tan specializes in advanced endoscopy, inflammatory bowel disease, liver diseases, and gastrointestinal oncology.',
  },
  {
    firstName: 'Fatima',
    lastName: 'Al-Hashimi',
    email: 'fatima.hashimi@mediclinic.ae',
    specialization: 'Reproductive Medicine & IVF',
    hospital: 'Mediclinic City Hospital',
    country: 'UAE',
    city: 'Dubai',
    experience: 15,
    qualifications: ['MBBS', 'MRCOG', 'Fellowship in Reproductive Medicine'],
    languages: ['English', 'Arabic', 'Urdu'],
    consultationFee: 130,
    currency: 'USD',
    rating: 4.9,
    totalReviews: 345,
    availableDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    availableTimeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    bio: 'Dr. Fatima Al-Hashimi is a pioneer in assisted reproductive technology with an exceptional success rate in IVF and fertility treatments.',
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('🗑️  Cleared existing doctors');

    // Insert seed doctors
    const inserted = await Doctor.insertMany(doctors);
    console.log(`✅ Inserted ${inserted.length} doctors`);

    console.log('\n📋 Seeded Doctors:');
    inserted.forEach((doc) => {
      console.log(`   • Dr. ${doc.firstName} ${doc.lastName} — ${doc.specialization} @ ${doc.hospital}, ${doc.country}`);
    });

    console.log('\n✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
