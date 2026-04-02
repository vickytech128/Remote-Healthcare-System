const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create sub-directories for reports
const reportsDir = path.join(uploadDir, 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, reportsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: patientId_timestamp_originalname
    const uniqueSuffix = `${req.patient ? req.patient._id : 'unknown'}_${Date.now()}`;
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext)
      .replace(/\s+/g, '-')
      .toLowerCase();
    cb(null, `${uniqueSuffix}_${baseName}${ext}`);
  },
});

// File filter – accept only PDFs, images, and common medical file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only PDF, images (JPEG, PNG, GIF, WebP), and Word documents are allowed.'
      ),
      false
    );
  }
};

// Upload middleware – max 10MB per file
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

module.exports = upload;
