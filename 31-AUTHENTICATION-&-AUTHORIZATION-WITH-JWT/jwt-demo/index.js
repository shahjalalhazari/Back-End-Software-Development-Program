const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const JWT_SECRET = 'json-secret-key';
const TOKEN_EXPIRY = '1h';
const users = [];

app.get('/', (request, response) => {
  response.json({ message: 'JWT demo API is running' });
});

// REGISTER ENDPOINT
app.post('/register', async(req, res) => {
    // GET THE REGISTRATION PAYLOAD
    const {username, password} = req.body;

    // NO USERNAME OR NO PASSWORD
    if (!username || !password) return res.status(400).json({error: "username and password required"});

    // FIND USER
    if (users.find(u => u.username === username)) return res.status(400).json({error: "user already exists"});

    // MAKE PASSWORD HASH & SAVE USERS LIST
    const passwordHash = await bcrypt.hash(password, 10);
    users.push({username, passwordHash});

    // RETURN THE SUCCESS RESPONSE
    res.status(201).json({ message: "User Registered", username});
});


app.post('/login', async(req, res) => {
    // LOGIN PAYLOAD
    const {username, password} = req.body;

    // FIND THE USER
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    // MATCH PASSWORD
    const matched = await bcrypt.compare(password, user.passwordHash);
    if (!matched) return res.status(401).json({ error: "invalid credentials" });

    // GENERATE TOKEN AND SEND RESPONSE
    const token = jwt.sign({username: user.username}, JWT_SECRET, {expiresIn: TOKEN_EXPIRY});
    res.json({ token });
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});