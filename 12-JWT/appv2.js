const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SIGNIN ROUTE
app.post("/signin", (req, res) => {
    const {username, password} = req.body;
    const data = {
        username: username,
        password: password
    };

    if (!password) return res.status(400).send("Password is required");
    const hash = crypto.createHmac("sha256", "1b96321b506ac595baf61ca", data).digest("hex");

    res.send(`Hash Value: ${hash}`);
});


app.get("/protected", (req, res) => {
    const {hash} = req.body;

    const data = {
        username: "shahjalal",
        password: "1234"
    };
    const hash2 = crypto.createHmac("sha256", "1b96321b506ac595baf61ca", data).digest("hex");

    if (hash === hash2) {
        res.status(200).send(`Hello ${data.username}, you have access to the protected routes!`);
    } else {
        res.status(401).send("Unauthorized");
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});