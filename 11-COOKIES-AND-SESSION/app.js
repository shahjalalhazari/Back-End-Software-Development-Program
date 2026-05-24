const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// SESSION STORAGE
const sessionStorage = {};

// LOGIN POST ROUTE
app.post("/login", (req, res) => {
    const {username} = req.body;
    res.cookie("name", username, {maxAge: 900000, httpOnly: true});
    sessionStorage[username] = { loggedIn: true};
    res.send("Cookie is set");
});


// PROTECTED ROUTE
app.get("/protected", (req, res) => {
    const {name} = req.cookies;
    if (sessionStorage[name] && sessionStorage[name].loggedIn) {
        res.send(`Hello, ${name}. you have access to the protected route!`);
    } else {
        res.status(401).send("Unauthorized")
    }
})

app.listen(3000, () => {
    console.log("Server is running!");
})