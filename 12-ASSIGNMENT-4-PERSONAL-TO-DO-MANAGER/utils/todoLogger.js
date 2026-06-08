const fs = require("fs");
const path = require("path");

// TO-DO DATA FILE PATH.
const todoFilePath = path.join(__dirname, "../assets/todos.json");

// FUNCTION TO SAVE TODO DATA TO THE FILE
const saveNewTodo = (todoData) => {
    let data = [];

    if (fs.existsSync(todoFilePath)) {
        const raw = fs.readFileSync(todoFilePath, "utf-8");
        if (raw.trim()) {
            data = JSON.parse(raw);
        }
    }

    // SAVE NEW TODO DATA TO THE FILE.
    data.push(todoData);
    fs.writeFileSync(todoFilePath, JSON.stringify(data, null, 2));
    return {
        success: true,
        message: "Todo added successfully."
    }
};


// FUNCTION TO GET TODOS OF CURRENT USER
const getTodoOfCurrentUser = (userId) => {
    if (fs.existsSync(todoFilePath)) {
        const raw = fs.readFileSync(todoFilePath, "utf-8");
        const data = JSON.parse(raw);
        return data.filter((todo) => todo.userId === userId);
    }
    return [];
};


// FUNCTION TO DELETE LOGGENIN USER TODO
const deleteTodoOfCurrentUser = (todoId, userId) => {
    if (fs.existsSync(todoFilePath)) {
        const raw = fs.readFileSync(todoFilePath, "utf-8");
        const data = JSON.parse(raw);

        // FIND THE TODO
        const todo = data.find(
            todo => todo.id === todoId && todo.userId === userId
        )
        // VALIDATE TODO
        if (!todo) return { success: false, message: "Todo not found."};

        // REMOVE & UPDATE TODO LIST.
        const updatedTodos = data.filter(
            todo => !(todo.id === todoId && todo.userId === userId)
        );

        fs.writeFileSync(todoFilePath, JSON.stringify(updatedTodos, null, 2));
        return { success: true };
    }
}


module.exports = {
    saveNewTodo,
    getTodoOfCurrentUser,
    deleteTodoOfCurrentUser
}