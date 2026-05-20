const express = require('express');
const app = express();
const port = 3000;


// RATE LIMITER MIDDLEWARE
const { default: rateLimit } = require("express-rate-limit");
const rateLimiter = rateLimit({
    windowMs: 1 * 1000,
    max: 2,
    message: "Too many requests from this IP, please try again later."
});
app.use(rateLimiter);


// USER AGENT MIDDLEWARE
const { checkUserAgent } = require('./middleware/userMiddleware');
app.use(checkUserAgent);


// ROOT ROUTE
app.get("/", (req, res) => {
    res.status(200).send("Hi, from Assignment-3: JSON File Storage by Shahjalal Hazari.")
})


// USER ROUTES
const userRoutes = require('./routes/userRoutes');
app.use("/api/users", userRoutes);


// PRODUCT ROUTES
const productRoutes = require('./routes/productRoutes');
app.use("/api/products", productRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});