const users = [
    { id: 1, name: "Shahjalal Hazari", email: "shahjalal.hazari@example.com" },
    { id: 2, name: "Emon Hazari", email: "emon.hazari@example.com" },
    { id: 3, name: "Rubayet Islam", email: "rubayet.islam@example.com" },
    { id: 4, name: "Rubayed Hazari", email: "rubayed.hazari@example.com" },
    { id: 5, name: "Irfan Mazumdar", email: "irfan.mazumdar@example.com" }
]


// GET ALL USERS
const getAllUsers = (req, res) => {
    res.status(200).json(users);
}

module.exports = {
    getAllUsers
}