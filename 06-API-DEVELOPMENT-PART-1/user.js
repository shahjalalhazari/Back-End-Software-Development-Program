const express = require("express");
const Joi = require("joi");
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

// CUSTOME VALIDATION
router.post("/users", (req, res) => {
    const {name, age, address} = req.body;
    
    if (!name || !age || !address) {
        return res.status(400).json({error:"All fields are required!"});
    }
    if (typeof name !== "string" || name.length < 3 || name.length > 100) {
        return res.status(400).json({error: "Name must be a string with length between 3 to 100 letters."});
    }
    if (typeof age !== "number" || age <= 0) {
        return res.status(400).json({error: "Age must be a positive number!"});
    }
    if (typeof address !== "string" || name.length < 5 || name.length > 150) {
        return res.status(400).json({error: "Address must be a string with length between 5 to 150 letters."});
    }
    
    const user = new User(req.body);
    res.status(201).json({
        message: "User created Successfully!",
        user: user
    })
});

// VALIDATION WITH THIRD-PARTY LIBRARY
const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    age: Joi.number().positive().required,
    address: Joi.string().min(5).required(),
});

router.post("/users/v2", (req, res) => {
    const {error} = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error})
    }
    
    const user = new User(req.body);
    res.status(201).json({
        message: "User created Successfully!",
        user: user
    })
});


module.exports = router;