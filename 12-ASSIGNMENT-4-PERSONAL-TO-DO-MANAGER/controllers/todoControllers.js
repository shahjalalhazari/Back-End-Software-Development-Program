const { saveNewTodo, getTodoOfCurrentUser, deleteTodoOfCurrentUser } = require("../utils/todoLogger");

// CONTROLLER FUNCTION TO ADD NEW TODO OF USER. 
const addTodoController = (req, res) => {
    // GET THE TODO TEXT REQUEST BODY AND VALIDATE IT
    const { text } = req.body;
    if (!text) return res.status(400).json({message: "Text field is required!"});

    // CREATE OBJECT OF NEW TODO DATA
    const newTodo = {
        id: Date.now().toString(),
        userId: req.user.userId,
        text: text,
        createdAt: new Date().toISOString()
    };

    // SAVE THE TODO DATA TO THE FILE.
    const result = saveNewTodo(newTodo);
    if (result.success) {
        return res.status(200).send(result.message);
    }
    res.status(400).json({message: "Something went wrong while adding todo"}); 
};


// GET ALL TODOS OF CURRENT / LOGGED IN USER
const getTodoOfUser = (req, res) => {
    const result = getTodoOfCurrentUser(req.user.userId);
    if (!result.length) {
        return res.status(404).json({ message: "No data found!" });
    }
    return res.status(201).send(result);
};


// DELETE CURRENT USER'S TODO
const deleteTodoController = (req, res) => {
    const {id} = req.params;
    const user = req.user.userId;

    const result = deleteTodoOfCurrentUser(id, user);
    if (!result.success) {
        return res.status(404).json({message: result.message});
    }

    res.status(200).json({message: "Todo deleted successfully!"})
}



module.exports = {
    addTodoController,
    getTodoOfUser,
    deleteTodoController
}