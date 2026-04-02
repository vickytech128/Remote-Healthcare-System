const Patient = require('../models/Patient');
const { generateToken } = require('../middleware/auth');

// @desc    Register a new patient
// @route   POST /api/patient/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      nationality,
      country,
      passportNumber,
      passportExpiry,
      medicalCondition,
    } = req.body;

    // Check required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and password are required.',
      });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email: email.toLowerCase() });
    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create new patient
    const patient = await Patient.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      nationality,
      country,
      passportNumber,
      passportExpiry,
      medicalCondition,
    });

    const token = generateToken(patient._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        country: patient.country,
        passportNumber: patient.passportNumber,
        medicalCondition: patient.medicalCondition,
        createdAt: patient.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login a patient
// @route   POST /api/patient/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find patient with password (password field is excluded by default)
    const patient = await Patient.findOne({ email: email.toLowerCase() }).select('+password');

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!patient.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.',
      });
    }

    // Compare passwords
    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(patient._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        country: patient.country,
        passportNumber: patient.passportNumber,
        medicalCondition: patient.medicalCondition,
        profilePicture: patient.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login };
