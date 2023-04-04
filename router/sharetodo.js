const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const { SharedTodo, validateSharedTodo } = require('../model/SharedTodoModel')
const { recievedSharedTodos } = require('../model/recievedsharedTodo')
const {Comment,} =  require('../model/commentmodel')
const { User } = require('../model/usermodel')
const { MyNotification } = require('../model/notiificationmodel')
const auth = require('../middleware/auth')
const _ = require('lodash')
const nodemailer = require('nodemailer')



router.post('/', auth, async (req, res) => {
  const { error } = validateSharedTodo(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const userObj = await User.findOne({ _id: req.user._id }, {_id:0, userName: 1 })
  console.log(userObj)
  
  const todoToShare = new SharedTodo(
    (_.pick(req.body, (['description', 'isCompleted', 'sharedWith', 'priority', 'comment', 'deadlineDate'])))
  )

  todoToShare.user = req.body._id
  await todoToShare.save()
   
  let usersId = [];
  for (const email of todoToShare.sharedWith) {
    const id = await User.findOne({ email: email }, { _id: 1 });
    usersId.push(id);
  }
  console.log(usersId);
  //for (users of users)
  let recievedTodo;
  let notifications;
  let count = 0;
  for (id of usersId) {
    recievedTodo = new recievedSharedTodos({
     sharedTodoId:todoToShare._id,
      description: req.body.description,
      sharedBy: userObj.userName,
      priority: req.body.priority,
      comment: req.body.comment,
      deadlineDate: req.body.deadlineDate,
      user: id
    })
    notifications = new MyNotification({
      message: `you just recieved a todo from ${userObj.userName}`,
      user: id
    })

    await recievedTodo.save()
    await notifications.save()
    sendMail(todoToShare.sharedWith[count],recievedTodo._id)
    count++;
    console.log(count)
    console.log(recievedTodo)
  }
  
  res.send(recievedTodo)
})

//get a shared todo via ID
router.get('/:id',auth, async(req,res)=>{
     if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('invalid Id')
     const shared_todo = await recievedSharedTodos.findOne ({_id:req.params.id})
     if(!shared_todo) return res.status(404).send('Todo with the id not found')
     res.send(shared_todo)
})


//   users.forEach(async (users)=>{


//       console.log(todo)
//   await todo.save()


//   })

// res.send(todoToShare)

//updtae a notification to true
router.patch('/:notifcationId', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.notifcationId)) return res.status(400).send('Invalid Id Parsed')
  const notification = await MyNotification.findByIdAndUpdate(req.params.notifcationId, { read: true }, { new: true })
  if (!notification) return res.status(404).send('Id not found')
  res.send(notification)
})
const joi =  require('joi')
//comment on a todo
router.post('/:sharedTodoId/comment',auth, async(req,res)=>{
  const schema = {
    user : joi.string().required(),
    text : joi.string().required()
  }
  const {error} =  joi.validate(req.body,schema)
  if(error) return res.status(400).send(error.details[0].message)
  const {userName} = await User.findOne({_id:req.user._id})
      const founded =await SharedTodo.findById(req.params.sharedTodoId)
   if(!(founded)) return res.status(400).send('sharetodo wth the given id not found')

  const comment =  new Comment({
    
      userName: userName,
      text : req.body.text
    
   
  })
  comment.save()
  await SharedTodo.findByIdAndUpdate({_id:req.params.sharedTodoId},{$push:{comments:comment}})
  await  recievedSharedTodos.updateMany({sharedTodoId:req.params.sharedTodoId},{$push:{comments:comment}})
  res.send('commented')
})



function sendMail(email, sharedTodoId) {
  try {
    const mailOptions = {
      from: 'amuneisrael224@gmail.com',
      to: email,
      subject: 'New Todo task',
      text: `you just got a new todo task click link to check http://localhost:3000/api/sharetodo/${sharedTodoId}`
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'amuneisrael224@gmail.com',
        pass: 'tdpmkubyowcmimiw'
      }
    })
    transporter.sendMail(mailOptions)
    console.log('email sent sucessfully')
  }
  catch (error) {
    console.log('failed to send email')
   // console.error(error)
  }

}
module.exports = router

