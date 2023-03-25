const multer = require("multer");
const path = require("path");

// Set up multer to handle file uploads with validation
const storage = multer.diskStorage({
  // Set the destination directory for the uploaded file
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  // Set the filename of the uploaded file to its original name
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  // Set a limit for the file size (5 MB)
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  // Filter out any files that do not have an allowed MIME type or file extension
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb("Error: Only images (jpeg|jpg|png|gif) are allowed");
    }
  },
}).single("image");

module.exports = upload;
