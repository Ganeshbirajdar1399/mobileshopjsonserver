const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();


// Configure CORS
app.use(cors({
  origin: 'https://gbmobile.onrender.com/', // Replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true // Include if your request requires cookies
}));

// Serve static files with CORS headers for multiple-uploads and uploads
app.use("/uploads", cors(), express.static(path.join(__dirname, "uploads")));
app.use(
  "/multiple-uploads",
  cors(),
  express.static(path.join(__dirname, "multiple-uploads"))
);

// JSON body parsing
app.use(express.json());

// Set up storage configurations for single and multiple file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const store = multer.diskStorage({
  destination: (req, file, cb) => {
    const multipleUploadPath = "./multiple-uploads/";
    if (!fs.existsSync(multipleUploadPath)) {
      fs.mkdirSync(multipleUploadPath, { recursive: true });
    }
    cb(null, multipleUploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const singleUpload = multer({ storage });
const multipleUpload = multer({ storage: store });

// Routes
// Single file upload route
app.post("/upload", singleUpload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const filePath = `http://localhost:3001/uploads/${req.file.filename}`;
  res.status(200).json({ filePath });
});

// Multiple file upload route
app.post("/multiple-upload", multipleUpload.array("images"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: "No files uploaded" });
  }

  // Map each uploaded file to its accessible URL
  const filePaths = req.files.map(
    (file) => `http://localhost:3001/multiple-uploads/${file.filename}`
  );

  res.status(200).json({ filePaths });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "An internal server error occurred" });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
