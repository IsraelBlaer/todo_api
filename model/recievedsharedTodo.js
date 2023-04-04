const mongoose = require('mongoose')

const {CommentSchema} =  require('./commentmodel')


const recievedSharedTodoSchema = new mongoose.Schema({
    
    description: {
        type: String,
        required: true,
    },
    sharedTodoId : {
        type : mongoose.Schema.Types.ObjectId, ref : 'sharedtodos'
    },
    priority: {
        type: String,
        enum: ['High', 'Low', 'Meduim'],
        default: 'Low'
    },
    isCompleted : {
      type:Boolean,
      default:false
    },
    comments: [
    
    CommentSchema
    ],
    sharedBy: { type: String },
    deadlineDate : { type : Date },
    user:{type : mongoose.Schema.Types.ObjectId, ref : 'user' }    
})


const recievedTodos = mongoose.model('recievedtodos',recievedSharedTodoSchema)
module.exports.recievedSharedTodos = recievedTodos


