const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const messageRoutes = require('./routes/messageRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically (for preview, not download)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health Check ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏥 Medical Tourism Patient Portal API is running',
    version: '1.0.0',
    endpoints: {
      patient: {
        signup: 'POST /api/patient/signup',
        login: 'POST /api/patient/login',
        dashboard: 'GET /api/patient/dashboard',
        getProfile: 'GET /api/patient/profile',
        updateProfile: 'PUT /api/patient/profile',
      },
      appointments: {
        create: 'POST /api/appointments',
        list: 'GET /api/appointments',
        single: 'GET /api/appointments/:id',
        cancel: 'PUT /api/appointments/:id/cancel',
      },
      reports: {
        upload: 'POST /api/reports',
        list: 'GET /api/reports',
        single: 'GET /api/reports/:id',
        download: 'GET /api/reports/:id/download',
        delete: 'DELETE /api/reports/:id',
      },
      messages: {
        send: 'POST /api/messages',
        list: 'GET /api/messages',
        markRead: 'PUT /api/messages/:id/read',
      },
      doctors: {
        list: 'GET /api/doctors',
        single: 'GET /api/doctors/:id',
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────
app.use('/api/patient', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/doctors', doctorRoutes);

// ─── Error Handling ───────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     🏥 Medical Tourism Patient Portal API         ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Server running on  : http://localhost:${PORT}        ║`);
  console.log(`║  Environment        : ${process.env.NODE_ENV || 'development'}              ║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
});

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Promise Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
