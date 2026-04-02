const Message = require('../models/Message');

// @desc    Get all messages for logged-in patient
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;

    const filter = { patient: req.patient._id, isArchived: false };
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Message.countDocuments(filter);

    const messages = await Message.find(filter)
      .populate('doctor', 'firstName lastName specialization hospital profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: messages.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a message as read
// @route   PUT /api/messages/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, patient: req.patient._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message marked as read.',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message to a doctor
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { doctorId, subject, content, appointmentId, priority } = req.body;

    if (!doctorId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Doctor and message content are required.',
      });
    }

    const message = await Message.create({
      patient: req.patient._id,
      doctor: doctorId,
      appointment: appointmentId || null,
      sender: 'patient',
      subject,
      content,
      priority: priority || 'normal',
    });

    await message.populate('doctor', 'firstName lastName specialization profilePicture');

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully.',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, markAsRead, sendMessage };
