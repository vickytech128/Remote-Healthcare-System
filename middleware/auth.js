const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Also check cookie (optional support)
  // else if (req.cookies?.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach patient to request
    const patient = await Patient.findById(decoded.id).select('-password');

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: 'Patient not found. Token invalid.',
      });
    }

    if (!patient.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.',
      });
    }

    req.patient = patient;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = { protect, generateToken };
