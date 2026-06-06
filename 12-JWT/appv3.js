const express = require('express');
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const JWT_SECRET = "your_jwt_secret_key";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// AUTH MIDDLEWARE
function authMiddleware(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];  // GET THE TOKEN FROM THE AUTHORIZATION HEADER

    if (!token) {
        return res.status(401).json({ message:"No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded)=> {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    })
}

// SIGNIN ROUTE
app.post("/signin", (req, res) => {
    const {username, password} = req.body;

    if (username === "shahjalal" && password === "1234") {
        const payload = {username};
        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "1h" });
        return res.json({token});
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});


app.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: `Hello ${req.user.username}, you have accessed to the protected routes!` });    
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});