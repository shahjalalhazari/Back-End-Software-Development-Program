const express = require('express');
const { countUserAgents } = require('../utils/mockLogger');
const { getUserAgentCount, getVisualizedCharts, getRealUserAgentCount } = require('../controllers/analyticsControllers');
const router = express.Router();


// VISUALIZATION ROUTES
router.get("/", getVisualizedCharts);

// GET USER AGENT COUNT
router.get("/user-agent", getUserAgentCount);

// GET REAL USER AGENT COUNT
router.get("/real-user-agent", getRealUserAgentCount);

module.exports = router;