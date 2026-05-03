const express = require("express");
const router = express.Router();


router.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    const filter = req.query.filter;
    res.status(200).send(`User ID is ${userId}, Filter is ${filter}`)
});


router.post("/users", (req, res) => {
    const {name, age} = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required"})
    }

    const user = {name, age};
    res.status(201).json({
        message: "User created Successfully!",
        user: user
    })
})

module.exports = router;