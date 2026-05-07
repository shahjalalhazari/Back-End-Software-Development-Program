const express = require("express");
const { isValidUser } = require("./middleware/user");
const app = express();

app.use(express.json());


const userRoute = require("./route/user");
app.use("/api/users", isValidUser, userRoute);

app.listen(3000, () => {
    console.log("Server Running on, 3000 port");
})