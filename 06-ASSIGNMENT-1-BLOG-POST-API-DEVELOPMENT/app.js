const express = require("express");
const app = express();

app.use(express.json());
const port = 3000;

// ROOT ROUTE
app.get("/", (req, res) => {
    res.status(200).send("Hi, from Assignment-1: Blog Post API development with GET & POST endpoints. Developed by Shahjalal Hazari.")
})

// BLOG ROUTES
const blogRoutes = require("./blogs");
app.use(blogRoutes);

app.listen(port, () => {
    console.log(`Server is running on, ${port} port`);
})