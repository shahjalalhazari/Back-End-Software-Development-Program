const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Max Size
});


// Single File Upload
router.post("/single", upload.single("file"), (req, res) => {
  if(!req.file) {
    return res.status(400).json({ error: "No file uploaded!"});
  }

  res.json({
    message: "File uploaded successfully!",
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/${req.file.filename}`,
    },
  });
})


// Multiple File Upload (Max 5 Files)
router.post("/multiple", upload.array("files", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No file uploaded!"});
  }

  const files = req.files.map((file) => ({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    url: `/uploads/${file.filename}`,
  }));

  res.json({
    message: `${files.length} file(s) uploaded successfully`,
    files,
  })
});


module.exports = router