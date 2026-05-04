const express = require("express");
const router = express.Router();


// USER OBJECT
class User {
    constructor({name, age, address}) {
        this.name = name;
        this.age = age;
        this.address = address;
    }
}

router.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    const filter = req.query.filter;
    res.status(200).send(`User ID is ${userId}, Filter is ${filter}`)
});


router.post("/users", (req, res) => {
    const user = new User(req.body);

    res.status(201).json({
        message: "User created Successfully!",
        user: user
    })
})

module.exports = router;