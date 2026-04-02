const Doctor = require('../models/Doctor');

// @desc    Get all doctors (with optional filters)
// @route   GET /api/doctors
// @access  Private
const getDoctors = async (req, res, next) => {
  try {
    const { specialization, hospital, country, page = 1, limit = 10 } = req.query;

    const filter = { isActive: true };
    if (specialization) filter.specialization = new RegExp(specialization, 'i');
    if (hospital) filter.hospital = new RegExp(hospital, 'i');
    if (country) filter.country = new RegExp(country, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Doctor.countDocuments(filter);

    const doctors = await Doctor.find(filter)
      .select('-__v')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: doctors.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Private
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-__v');

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDoctors, getDoctorById };
