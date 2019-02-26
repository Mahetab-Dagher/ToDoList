var express = require('express');
var router = express.Router();
var jwt = require('express-jwt')
var TodoList = require('../models/todoList')

router.get('/', jwt({
    secret: process.env.secret
}), (req, res) => {
    console.log('ru', req.user)
    TodoList.findOne({userId: req.user._id}, (err, list) => {
        if(err || !list){
            return res.status(400).json({
                message: err || "todo list is empty"
            })
        }
        else{
            return res.status(200).json({
                message: list
            })
        }
    })
})

router.post('/', jwt({
    secret: process.env.secret
}), (req, res) => {
    let item = req.body
    console.log(item)
    TodoList.findOneAndUpdate({userId: req.user._id}, { $push: {todoItems: item}}, {new: true}, (err, list) => {
        if(err){
            return res.status(400).json({
                message: err 
            })
        }
        else if(list){
            return res.status(200).json({
                message: list
            })
        }
        else{
            let lst = new TodoList({
                userId: req.user._id,
                todoItems: [item]
            })
            lst.save()
            .then(ls => {
                if(ls){
                    return res.status(200).json({
                        message: ls
                    })
                }
            })
            .catch(err => {
                return res.status(400).json({
                    message: err
                })
            })

        }
    })
})
module.exports = router;