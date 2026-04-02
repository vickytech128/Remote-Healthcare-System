const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const {
  getDashboard,
  getProfile,
  updateProfile,
} = require('../controllers/patientController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (require JWT)
router.get('/dashboard', protect, getDashboard);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
