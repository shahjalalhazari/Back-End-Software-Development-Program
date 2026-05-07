const { saveUserAgent } = require("../utils/logger");


const isValidUser = (req, res, next) => {
    const token = req.query.token;
    if (token === "123") {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
}


// SAVE USER AGENT DATA
const checkUserAgent = (req, res, next) => {
    const userAgent = req.headers['user-agent'];
    const blockedPatterns = [
        /curl/i,
        /wget/i,
        /paython-requests/i,
        /Go-http-client/i,
        /java/i
        /sqlmap/i,
        /nmap/i,
        /Nikto/i,
        /HeadlessChrome/i,
        /PhantomJS/i
    ]
    const isBlocked = blockedPatterns.some(pattern => pattern.test(userAgent));

    saveUserAgent({ userAgent, timestamp: new Date() });

    if (!userAgent || isBlocked) {
        res.status(400).json({ message: "Missing User-Agent header" });
    }
    next();
}

module.exports = {
    isValidUser,
    checkUserAgent
}