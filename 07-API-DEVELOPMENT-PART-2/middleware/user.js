const isValidUser = (req, res, next) => {
    const token = req.query.token;
    if (token === "123") {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = {
    isValidUser
}