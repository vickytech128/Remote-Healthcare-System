const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

// All appointment routes are protected
router.use(protect);

// POST /api/appointments       - Request new appointment
// GET  /api/appointments       - Get all appointments (with ?status=&upcoming=true)
router.route('/').post(createAppointment).get(getAppointments);

// GET /api/appointments/:id         - Get single appointment
// PUT /api/appointments/:id/cancel  - Cancel appointment
router.get('/:id', getAppointmentById);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;
