const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Request a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res, next) => {
  try {
    const {
      doctorId,
      hospital,
      treatment,
      appointmentDate,
      timeSlot,
      appointmentType,
      symptoms,
      notes,
      country,
      city,
    } = req.body;

    // Validate required fields
    if (!doctorId || !hospital || !treatment || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message:
          'Doctor, hospital, treatment, appointment date, and time slot are required.',
      });
    }

    // Check doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    // Ensure appointment date is in the future
    const apptDate = new Date(appointmentDate);
    if (apptDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date must be in the future.',
      });
    }

    // Check for conflicting appointment (same doctor, same date & time)
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: apptDate,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message:
          'This time slot is already booked with the selected doctor. Please choose another time.',
      });
    }

    const appointment = await Appointment.create({
      patient: req.patient._id,
      doctor: doctorId,
      hospital,
      treatment,
      appointmentDate: apptDate,
      timeSlot,
      appointmentType: appointmentType || 'in-person',
      symptoms,
      notes,
      country,
      city,
      consultationFee: doctor.consultationFee,
      currency: doctor.currency,
    });

    // Populate doctor details for response
    const populated = await appointment.populate(
      'doctor',
      'firstName lastName specialization hospital profilePicture'
    );

    return res.status(201).json({
      success: true,
      message: 'Appointment requested successfully. Please wait for confirmation.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments for logged-in patient
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
  try {
    const { status, upcoming, page = 1, limit = 10 } = req.query;

    const filter = { patient: req.patient._id };

    if (status) {
      filter.status = status;
    }

    if (upcoming === 'true') {
      filter.appointmentDate = { $gte: new Date() };
      filter.status = { $in: ['pending', 'confirmed'] };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Appointment.countDocuments(filter);

    const appointments = await Appointment.find(filter)
      .populate('doctor', 'firstName lastName specialization hospital country city profilePicture consultationFee currency')
      .sort({ appointmentDate: upcoming === 'true' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.patient._id,
    }).populate('doctor', 'firstName lastName specialization hospital country city profilePicture qualifications consultationFee currency');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.patient._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed appointment.',
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled.',
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment,
};
