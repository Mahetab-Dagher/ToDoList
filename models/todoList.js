var mongoose = require('mongoose')

const todoListSchema = mongoose.Schema({
    userId: String,
    todoItems: [{
        name: String,
        description: String
    }]
})

const TodoList = mongoose.model('todolist', todoListSchema)

module.exports = TodoList;