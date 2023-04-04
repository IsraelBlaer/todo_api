const mongoose = require("mongoose")
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { Todo, Validate } = require('../model/todomodel')
const joi = require('joi')
const validateObjectId = require('../middleware/validateobjectId')
const validateReq = require('../middleware/validateReq')
const auth = require('../middleware/auth')





//post a todo /create todo
router.post('/', [auth, validateReq], async (req, res) => {
    
    const todo = new Todo(_.pick(req.body, (['description', 'category','user'])))
   // todo.user= req.user._id
     
    await todo.save()
    res.send(_.pick(todo, ['description', 'isCompleted', 'priority']))
})


//getall todos
router.get('/', auth, async (req, res) => {
    const todos = await Todo.find({ user: req.body.user });
    const filteredTodos = todos.map(todo => _.pick(todo, ['description', 'isCompleted', 'category', 'priority']));
    res.send(filteredTodos);
});


//get a todo by particular category
router.get('/category/:categoryType', auth, async (req, res) => {
    const { error } = joi.validate(req.params.categoryType, joi.string().valid('Personal', 'Shopping', 'Wishlist', 'Work', 'All'))
    if (error) return res.status(400).send('bad request')
    const todos = await Todo.find({ category: req.params.categoryType, user: req.body.user })
    const filteredTodos = todos.map(todo => _.pick(todo, ['description', 'isCompleted', 'priority']))
    res.send(filteredTodos)
})

//GET A TODO BY CATGEORY
router.get('/id/:todoId', [auth, validateObjectId], async (req, res) => {

    if (!isValid) return res.status(400).send('Invalid todo ID')
    const todo = await Todo.findOne({ user: req.body.user, _id: req.params.todoId })
    if (!todo) return res.status(404).send('Todo with the given ID not found')
    res.send(_.pick(todo, ['description', 'isCompleted', 'priority']))
})

//update the state of a todo
router.put('/:todoId', [auth, validateObjectId, validateReq], async (req, res) => {

    let todo = await Todo.findOne({ user: req.body.user, _id: req.params.todoId })
    if (!todo) return res.status(404).send('todo with the given ID not found')

    todo.description = req.body.description;
    todo.isCompleted = req.body.isCompleted;
    todo.category = req.body.category;
    todo.updatedAt = new Date();

    await todo.save()

    res.send(_.pick(todo, ['description', 'isCompleted', 'updatedAt']))

    await runCheck()
})

//delete a user todo
router.delete('/:todoId', [auth, validateObjectId], async (req, res) => {
    const deletedTodo = await Todo.deleteOne({ _id: req.params.todoId, user: req.body.user })
    if (deletedTodo.deletedCount < 1) return res.status(404).send("todo wih the given ID not found")
    res.send('item deleted sucessfully')
})

//delete completed todos('/)
async function runCheck() {
    const todo = await Todo.find({ isCompleted: true })
    todo.forEach(async (todo) => {
        await Todo.findByIdAndRemove(todo._id)
    });
}



module.exports = router

