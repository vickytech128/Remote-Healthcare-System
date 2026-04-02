const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

// All doctor routes are protected
router.use(protect);

// GET /api/doctors             - Get all doctors (with ?specialization=&hospital=&country=)
// GET /api/doctors/:id         - Get single doctor
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

module.exports = router;
