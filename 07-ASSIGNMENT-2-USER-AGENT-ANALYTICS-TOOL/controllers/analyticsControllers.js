const path = require('path');
const { countUserAgents } = require("../utils/mockLogger");
const { countRealUserAgents } = require('../utils/logger');

// CONTROLLER TO GET MOCK USER AGENT COUNT
const getUserAgentCount = (req, res) => {
    const userAgentCounts = countUserAgents();
    res.status(200).json(userAgentCounts);
};

// CONTROLLER TO SERVE ANALYTICS HTML PAGE
const getVisualizedCharts = (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../analytics.html"));
}

// CONTROLLER TO GET REAL USER AGENT COUNT
const getRealUserAgentCount = (req, res) => {
    const realUserAgentCounts = countRealUserAgents();
    res.status(200).json(realUserAgentCounts);
}

module.exports = {
    getUserAgentCount,
    getVisualizedCharts,
    getRealUserAgentCount
};