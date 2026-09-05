const path = require("path");

const ALLOWED_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
]);

const ALLOWED_MIMETYPE = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

function fileTypeValidator(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const isAllowedExtension = ALLOWED_EXTENSIONS.has(ext);
    const isAllowedMimeType = ALLOWED_MIMETYPE.has(file.mimetype);
    const hasGenericMimeType = file.mimetype === "application/octet-stream";

    if (isAllowedExtension && (isAllowedMimeType || hasGenericMimeType)) {
        return cb(null, true);
    }

    cb(new Error(`File type not allowed: ${ext} (${file.mimetype})`));
};

module.exports = fileTypeValidator;