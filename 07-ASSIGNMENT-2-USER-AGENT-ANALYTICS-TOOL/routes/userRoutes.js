const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userControllers');

// GET ALL USERS
router.get('/', getAllUsers);

module.exports = router;