const fs = require("fs");
const path = require("path");

// USER DATA FILE PATH AND FUNCTION TO SAVE USER DATA TO THE FILE.
const usersFilePath = path.join(__dirname, "../assets/users.json");
const saveUserData = (userData) => {
    let data = [];

    if (fs.existsSync(usersFilePath)) {
        const raw = fs.readFileSync(usersFilePath, "utf-8");
        if (raw.trim()) {
            data = JSON.parse(raw);
        }
    }

    // CHECK USER IS ALREADY EXISTS OR NOT.
    const existingUser = data.find(
        (user) => user.username.toLowerCase() === userData.username.toLowerCase()
    );
    if (existingUser) {
        return {
            success: false,
            message: "User already exists."
        }
    }

    // IF USER NOT EXISTS THEN SAVE THE USER DATA TO THE FILE.
    data.push(userData);
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
    return {
        success: true,
        message: "User created successfully."
    }
};


// FUNCTION TO CHECK IF USER EXISTS.
const checkUser = (username) => {
    if (fs.existsSync(usersFilePath)) {
        const raw = fs.readFileSync(usersFilePath, "utf-8");
        const data = JSON.parse(raw);
        return data.find((user) => user.username.toLowerCase() === username.toLowerCase());
    }
    return null;
};


module.exports = {
    saveUserData,
    checkUser
};