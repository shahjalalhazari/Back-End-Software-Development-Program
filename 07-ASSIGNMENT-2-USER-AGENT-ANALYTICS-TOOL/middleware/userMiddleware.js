const { saveUserAgent } = require("../utils/logger");

const checkUserAgent = (req, res, next) => {
    const userAgent = req.headers['user-agent'] || "unknown";
    saveUserAgent(userAgent);
    next();
};

module.exports = {
    checkUserAgent
};