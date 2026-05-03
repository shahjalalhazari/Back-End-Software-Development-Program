const express = require("express");
const route = express.Router();

route.get("/user/:id/payment", (req, res) => {
    const userId = req.params.id;
    const filter = req.query.filter;
    console.log("Payment done");
    res.send(`Payment done of ${userId}`);
})

module.exports = route;