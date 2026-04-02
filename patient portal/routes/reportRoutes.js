const express = require('express');
const router = express.Router();
const {
  uploadReport,
  getReports,
  getReportById,
  downloadReport,
  deleteReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All report routes are protected
router.use(protect);

// POST /api/reports            - Upload a new report (multipart/form-data, field: "report")
// GET  /api/reports            - Get all reports (with ?reportType=)
router.route('/')
  .post(upload.single('report'), uploadReport)
  .get(getReports);

// GET    /api/reports/:id           - Get single report metadata
// DELETE /api/reports/:id           - Delete a report
router.route('/:id').get(getReportById).delete(deleteReport);

// GET /api/reports/:id/download     - Download report file
router.get('/:id/download', downloadReport);

module.exports = router;
