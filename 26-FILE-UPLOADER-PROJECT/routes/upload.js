const express = require("express");
const multer = require("multer");
const path = require("path");
const fileTypeValidator = require("../middleware/fileTypeValidator");
const { enqueueUpload, enqueueUploads } = require("../services/fastq.service");

const router = express.Router();
const uploadRateLimiter = require("../middleware/uploadRateLimiter");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/uploads"),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Max Size
  fileFilter: fileTypeValidator,
});


// Single File Upload
router.post("/single", upload.single("file"), uploadRateLimiter, async (req, res, next) => {
  if(!req.file) {
    return res.status(400).json({ error: "No file uploaded!"});
  }

  try {
    const uploadedFile = await enqueueUpload(req.file);

    res.json({
      message: "File uploaded successfully!",
      file: {
        key: uploadedFile.key,
        originalname: uploadedFile.originalname,
        size: uploadedFile.size,
        mimetype: uploadedFile.mimetype,
        url: uploadedFile.url,
      },
    });
  } catch (error) {
    next(error);
  }
})


// Multiple File Upload (Max 5 Files)
router.post("/multiple", upload.array("files", 5), uploadRateLimiter, async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No file uploaded!"});
  }

  try {
    const files = await enqueueUploads(req.files);

    res.json({
      message: `${files.length} file(s) uploaded successfully`,
      files,
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router