const crypto = require("crypto");
const fs = require("fs");

const users = new Map();

const FIVE_MINUTES = 5 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

const MAX_TOTAL_SIZE = 1* 1024 * 1024 * 1024;
const MAX_IMAGES = 50;

// GET THE USER OR IP
function getUserKey(req) {
    return req.ip;
};

// STORE USER RECORD
function getUserRecord(userKey) {
    if (!users.has(userKey)) {
        users.set(userKey, {
            dailySize: 0,
            dailySizeDate: new Date().toDateString(),
            uploads: [],
            fileHashes: new Map(),
            consecutiveViolations: 0,
            bannedUntil: null,
        });
    };

    return users.get(userKey);
};

// CONVERT FILES INTO HASH
function calculateFileHash(filePath) {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(buffer).digest("hex");
};

// DELETE FILE
function deleteFile(file) {
    if (!file || !file.path) {
        return;
    };

    fs.unlink(file.path, (err) => {
        if (err && err.code !== "ENOENT") {
            console.error("Failed to delete rejected file:", err);
        };
    });
};

// DELETE UPLOADED FILE(S)
function deleteUploadedFiles(req) {
    if (req.file) {
        deleteFile(req.file);
    };

    if (req.files && Array.isArray(req.files)) {
        req.files.forEach(deleteFile);
    };
};

// GET THE FILES
function getFiles(req) {
    if (req.file) {
        return [req.file];
    }

    if (req.files && Array.isArray(req.files)) {
        return req.files
    }

    return [];
};

// CLEAN / DELETE OLD UPLOADED FILES
function cleanupOldUploads(user) {
    const now = Date.now();

    user.uploads = user.uploads.filter(
        (upload) => now - upload.timestamp < TEN_MINUTES,
    );
};

// CLEAN OLD HASHES
function cleanupOldHashes(user) {
    const now = Date.now();

    for (const [hash, timestamp] of user.fileHashes.entries()) {
        if (now - timestamp >= FIVE_MINUTES) {
            user.fileHashes.delete(hash);
        }
    }
};

// RECORD USER VIOLATION
function recordViolation(user) {
    user.consecutiveViolations += 1;

    if (user.consecutiveViolations >= 3) {
        user.bannedUntil = Date.now() + THREE_DAYS;
    }
}

// RESET VIOLATIONS
function resetViolations(user) {
    user.consecutiveViolations = 0;
}

// RESET DAILY UPLOAD LIMIT SIZE
function resetDailySize(user) {
    const today = new Date().toDateString();

    if (user.dailySizeDate !== today) {
        user.dailySize = 0;
        user.dailySizeDate = today;
    }
}

// MAIN UPLOAD RATE LIMITER
function uploadRateLimiter(req, res, next) {
    const userKey = getUserKey(req);
    const user = getUserRecord(userKey);
    const now = Date.now();

    resetDailySize(user);

    // CHECK BAN
    if (user.bannedUntil && now < user.bannedUntil) {
        deleteUploadedFiles(req);
        
        const remainingTime = user.bannedUntil - now;

        return res.status(429).json({
            message: "You're banned form uploading files for 3 days because of violating uploading rules.",
            bannedUntil: new Date(user.bannedUntil).toISOString(),
            remainingTime: remainingTime,
        })
    }

    // BAN EXPIRED
    if (user.bannedUntil && now >= user.bannedUntil) {
        user.bannedUntil = null;
        user.consecutiveViolations = 0;
    }

    cleanupOldUploads(user);
    cleanupOldHashes(user);

    const files = getFiles(req);

    if (files.length === 0) {
        return next();
    }

    // CHECK UPLOADED FILE SIZE
    const currentUploadSize = files.reduce(
        (total, file) => total + file.size, 0,
    );

    if (user.dailySize + currentUploadSize > MAX_TOTAL_SIZE) {
        deleteUploadedFiles(req);
        recordViolation(user);

        return res.status(429).json({
            message: "Daily upload limit exceeded. You can't upload more than 1 GB of data per day.",
            currentDailySize: user.dailySize,
            attemptedSize: currentUploadSize,
            consecutiveViolations: user.consecutiveViolations,
        });
    }

    // CHECK 50 IMAGES / 10 MINUTES
    if (user.uploads.length + files.length > MAX_IMAGES) {
        deleteUploadedFiles(req);
        recordViolation(user);

        return res.status(429).json({
            message: "Image upload limit exceed. You can't upload more than 50 images within 10 minutes.",
            imagesUploadedInLast10Min: user.uploads.length,
            attemptedImages: files.length,
            consecutiveViolations: user.consecutiveViolations,
        });
    }

    // SAME FILE IN 5 MIN
    const hashes = [];

    for (const file of files) {
        const hash = calculateFileHash(file.path);

        if (user.fileHashes.has(hash)) {
            deleteUploadedFiles(req);
            recordViolation(user);

            return res.status(429).json({
                message: "Duplicate file upload. Same file can't be uploaded within 5 min",
                consecutiveViolations: user.consecutiveViolations,
            });
        }

        // Prevent duplicate files while uploading multiple files
        if (hashes.includes(hash)) {
            deleteUploadedFiles(req);
            recordViolation(user);

            return res.status(429).json({
                message: "Duplicate file upload. Same file can't be uploaded more than once",
                consecutiveViolations: user.consecutiveViolations,
            });
        };
        hashes.push(hash);
    }

    // RECORD SUCCESSFULL UPLOAD
    user.dailySize += currentUploadSize;

    files.forEach((file, index) => {
        const hash = hashes[index];
        user.fileHashes.set(hash, now);

        user.uploads.push({
            timestamp: now,
            size: file.size,
        });
    });

    // AFTER SUCCESSFUL UPLOAD & RESET VIOLATION
    resetViolations(user);
    next();
}

module.exports = uploadRateLimiter;