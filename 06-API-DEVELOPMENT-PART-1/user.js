const express = require("express");
const router = express.Router();


router.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    const filter = req.query.filter;
    res.send(`User ID is ${userId}, Filter is ${filter}`)
});

module.exports = router;