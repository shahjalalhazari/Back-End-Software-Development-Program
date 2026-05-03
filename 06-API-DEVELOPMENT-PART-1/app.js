const express = require("express");
const app = express();

app.use(express.json());

// app.get("/users/:id", (req, res) => {
//     const userId = req.params.id;
//     const filter = req.query.filter;
//     res.send(`User ID is ${userId}, Filter is ${filter}`)
// })

const userRoute = require("./user");
app.use(userRoute);

const paymentRoute = require("./payment");
app.use(paymentRoute);

app.listen(3000, () => {
    console.log("Server Running on, 3000 port");
})