const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const router = express.Router();


// @route   GET /api/users
router.get("/",getAllUsers)


module.exports = router;