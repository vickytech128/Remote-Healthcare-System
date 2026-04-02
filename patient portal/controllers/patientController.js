const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Report = require('../models/Report');
const Message = require('../models/Message');

// @desc    Get patient dashboard data (upcoming appointments, reports, messages)
// @route   GET /api/patient/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    const patientId = req.patient._id;
    const now = new Date();

    // Upcoming appointments (next 30 days, not cancelled)
    const upcomingAppointments = await Appointment.find({
      patient: patientId,
      appointmentDate: { $gte: now },
      status: { $in: ['pending', 'confirmed'] },
    })
      .populate('doctor', 'firstName lastName specialization hospital profilePicture')
      .sort({ appointmentDate: 1 })
      .limit(5);

    // Recent medical reports (last 10)
    const recentReports = await Report.find({ patient: patientId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('doctor', 'firstName lastName specialization');

    // Unread doctor messages
    const unreadMessages = await Message.find({
      patient: patientId,
      sender: 'doctor',
      isRead: false,
      isArchived: false,
    })
      .populate('doctor', 'firstName lastName specialization profilePicture')
      .sort({ createdAt: -1 })
      .limit(10);

    // Summary counts
    const totalAppointments = await Appointment.countDocuments({ patient: patientId });
    const completedAppointments = await Appointment.countDocuments({
      patient: patientId,
      status: 'completed',
    });
    const totalReports = await Report.countDocuments({ patient: patientId });
    const unreadCount = await Message.countDocuments({
      patient: patientId,
      sender: 'doctor',
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalAppointments,
          completedAppointments,
          upcomingCount: upcomingAppointments.length,
          totalReports,
          unreadMessages: unreadCount,
        },
        upcomingAppointments,
        recentReports,
        unreadMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient profile
// @route   GET /api/patient/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.patient._id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient profile
// @route   PUT /api/patient/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    // Fields NOT allowed to be updated through this endpoint
    const restrictedFields = ['password', 'email', 'isActive'];
    restrictedFields.forEach((field) => delete req.body[field]);

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.patient._id,
      { $set: req.body },
      {
        new: true,           // return updated document
        runValidators: true, // run schema validators
      }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedPatient,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, getProfile, updateProfile };
