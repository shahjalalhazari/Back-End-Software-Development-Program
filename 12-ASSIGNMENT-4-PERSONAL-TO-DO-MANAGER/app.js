const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();


// RATE LIMITER MIDDLEWARE
const { default: rateLimit } = require("express-rate-limit");
const rateLimiter = rateLimit({
  windowMs: 1 * 1000,
  max: 2,
  message: "Too many requests from this IP, please try again later."
});
app.use(rateLimiter);


// ROOT ROUTE
app.get("/", (req, res) => {
  res.status(200).send("Hi, from Assignment-4: Personal To-Do Manager with authentication by Shahjalal Hazari.")
})


// AUTH ROUTES
const authRoutes = require("./routes/authRoutes")
app.use("/api/auth", authRoutes);


// TO-DO ROUTES
const todoRoutes = require("./routes/todoRoutes");
app.use("/api/todo", todoRoutes);


// STARTING THE SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});