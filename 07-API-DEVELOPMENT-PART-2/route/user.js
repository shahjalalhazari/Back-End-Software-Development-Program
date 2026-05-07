const express = require('express');
const router = express.Router();

const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
];

router.get('/users', (req, res) => {
    res.json(users);
});


module.exports = router;