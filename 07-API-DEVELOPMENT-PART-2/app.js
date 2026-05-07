const express = require("express");
const { isValidUser, checkUserAgent } = require("./middleware/user");
const { default: rateLimit } = require("express-rate-limit");
const app = express();

app.use(express.json());
app.use(checkUserAgent);


const rateLimiter = rateLimit({
    windowMs: 1 * 1000, // 1 second
    max: 1, // limit each IP to 1 request per windowMs
    message: "Too many requests from this IP, please try again later."
});



const userRoute = require("./route/user");
app.use("/api/users",rateLimiter, isValidUser, userRoute);

app.listen(3000, () => {
    console.log("Server Running on, 3000 port");
})