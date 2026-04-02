const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
    },
    reportType: {
      type: String,
      required: [true, 'Report type is required'],
      enum: [
        'blood-test',
        'x-ray',
        'mri',
        'ct-scan',
        'ultrasound',
        'ecg',
        'pathology',
        'prescription',
        'discharge-summary',
        'other',
      ],
      default: 'other',
    },
    description: {
      type: String,
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    reportDate: {
      type: Date,
      default: Date.now,
    },
    hospital: {
      type: String,
      trim: true,
    },
    labName: {
      type: String,
      trim: true,
    },
    isSharedWithDoctor: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
reportSchema.index({ patient: 1, createdAt: -1 });
reportSchema.index({ patient: 1, reportType: 1 });

module.exports = mongoose.model('Report', reportSchema);
