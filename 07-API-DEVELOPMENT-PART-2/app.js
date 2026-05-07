const express = require("express");
const app = express();

app.use(express.json());

const userRoute = require("./route/user");
app.use("/api/users", userRoute);

app.listen(3000, () => {
    console.log("Server Running on, 3000 port");
})