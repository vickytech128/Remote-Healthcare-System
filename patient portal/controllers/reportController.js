const path = require('path');
const fs = require('fs');
const Report = require('../models/Report');

// @desc    Upload a medical report
// @route   POST /api/reports
// @access  Private
const uploadReport = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please attach a file.',
      });
    }

    const { title, reportType, description, reportDate, hospital, labName, doctorId, appointmentId, tags } = req.body;

    if (!title) {
      // Clean up uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Report title is required.',
      });
    }

    const report = await Report.create({
      patient: req.patient._id,
      doctor: doctorId || null,
      appointment: appointmentId || null,
      title,
      reportType: reportType || 'other',
      description,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      reportDate: reportDate ? new Date(reportDate) : new Date(),
      hospital,
      labName,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
    });

    await report.populate('doctor', 'firstName lastName specialization');

    return res.status(201).json({
      success: true,
      message: 'Report uploaded successfully.',
      data: report,
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Get all reports for logged-in patient
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res, next) => {
  try {
    const { reportType, page = 1, limit = 10 } = req.query;

    const filter = { patient: req.patient._id };
    if (reportType) {
      filter.reportType = reportType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Report.countDocuments(filter);

    const reports = await Report.find(filter)
      .populate('doctor', 'firstName lastName specialization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: reports.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      patient: req.patient._id,
    }).populate('doctor', 'firstName lastName specialization');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download a report file
// @route   GET /api/reports/:id/download
// @access  Private
const downloadReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      patient: req.patient._id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    const absolutePath = path.resolve(report.filePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({
        success: false,
        message: 'Report file not found on server. It may have been deleted.',
      });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${report.originalName}"`);
    res.setHeader('Content-Type', report.mimeType);

    return res.sendFile(absolutePath);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      patient: req.patient._id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    // Delete file from disk
    const absolutePath = path.resolve(report.filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await report.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Report deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadReport,
  getReports,
  getReportById,
  downloadReport,
  deleteReport,
};
