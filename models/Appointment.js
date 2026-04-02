const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required'],
    },
    hospital: {
      type: String,
      required: [true, 'Hospital is required'],
      trim: true,
    },
    treatment: {
      type: String,
      required: [true, 'Treatment is required'],
      trim: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
      default: 'pending',
    },
    appointmentType: {
      type: String,
      enum: ['in-person', 'video-consultation', 'follow-up'],
      default: 'in-person',
    },
    symptoms: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    doctorNotes: {
      type: String,
      trim: true,
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'insurance', 'online', 'pending'],
      default: 'pending',
    },
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
