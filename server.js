const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize express app
const app = express();
const port = 3000;

// Ensure 'uploads' directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create 'uploads' directory if it doesn't exist
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
  }
});

// Create a multer instance with file size limit (5MB as an example)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (adjust as needed)
}).single('file'); // Expect only a single file in the form

// Serve static files (HTML, CSS, etc.)
app.use(express.static(__dirname)); // This will serve the HTML file from the current directory

// Handle file upload route
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle specific multer errors
      return res.status(400).send({ message: `Multer error: ${err.message}` });
    } else if (err) {
      // Handle general errors
      return res.status(500).send({ message: `File Successfully Uploaded: ${err.message}` });
    }

    // If no error, send success response
    res.send({
      message: 'File uploaded successfully!',
      file: req.file,
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
