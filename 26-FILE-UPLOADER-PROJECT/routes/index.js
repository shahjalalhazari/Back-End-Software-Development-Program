const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Basic Express.js app is running successfully!',
    status: 'OK'
  });
});

module.exports = router;
