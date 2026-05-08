const express = require("express");
const app = express();
const port = 3000;


const { checkUserAgent } = require("./middleware/userMiddleware");


app.use(checkUserAgent);

const { default: rateLimit } = require("express-rate-limit");
const rateLimiter = rateLimit({
    windowMs: 1 * 1000,
    max: 3,
    message: "Too many requests from this IP, please try again later."
});
app.use(rateLimiter);


// ROOT ROUTE
app.get("/", (req, res) => {
    res.status(200).send("Hi, from Assignment-2: User Agent Analytics Tool. Developed by Shahjalal Hazari.")
})


// USER ROUTES
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


// ANALYTICS ROUTES
const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/analytics', analyticsRoutes);


app.listen(port, () => { 
    console.log(`Server is running on http://localhost:${port}`);
});