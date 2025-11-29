// middleware/uploadMiddleware.js

const multer = require('multer');
const path = require('path');

// --- 1. Storage Configuration ---
const storage = multer.diskStorage({
  // Destination where the file will be saved
  destination: (req, file, cb) => {
    // You must ensure this 'uploads/' directory exists on your server's filesystem
    cb(null, 'uploads/'); 
  },
  // Filename configuration
  filename: (req, file, cb) => {
    // Create a unique filename: fieldname-timestamp.ext
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// --- 2. File Filter (Optional but recommended) ---
const fileFilter = (req, file, cb) => {
  // Check file type to accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    // Reject file with an error message
    cb(new Error('Only image files are allowed!'), false); 
  }
};

// --- 3. Multer Instance ---
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB file size limit
  }
});

module.exports = upload;