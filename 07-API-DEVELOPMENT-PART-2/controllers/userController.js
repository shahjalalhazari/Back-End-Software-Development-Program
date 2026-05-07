const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// GET ALL USERS
const getAllUsers = (req, res) => {
    res.json(users);
};

// DELETE USER
const deleteUser = (req, res) => {
    // const userId = parseInt(req.params.id);
    // const userIndex = users.findIndex(user => user.id === userId);
    // if (userIndex === -1) {
    //     return res.status(404).json({ message: 'User not found' });
    // }
    // users.splice(userIndex, 1);
    res.json({ message: 'User deleted successfully' });
};

// UPDATE USER
const updateUser = (req, res) => {
    // const userId = parseInt(req.params.id);
    // const userIndex = users.findIndex(user => user.id === userId);
    // if (userIndex === -1) {
    //     return res.status(404).json({ message: 'User not found' });
    // }
    // users[userIndex] = { ...users[userIndex], ...req.body };
    res.json({ message: 'User updated successfully' });
};

module.exports = {
    getAllUsers,
    deleteUser,
    updateUser
};