
const mongoose =  require('mongoose')
const joi =  require('joi')
joi.objectId = require('joi-objectid')(joi)

const todoSchema = new mongoose.Schema({
    
    
    description : {
    type: String,
    required : true ,
    maxLength: 80
    },
    category: {
     type  :String,
     enum : ['Personal','Shopping','Wishlist','Work',"All"],
     default: 'All'  
    },
    priority : {
        type : String,
        enum : ['High','Low','Meduim'],
        default: 'Low'  
       },

    isCompleted : {
      type:Boolean,
      default:false
    },

    user : {
      type: mongoose.Schema.Types.ObjectId,
      ref:'user'
    },
    createdAt :{ type : Date , default:Date.now},
    updatedAt : {type:Date}
    
})


const todoModel = mongoose.model('todo',todoSchema)

 
function validateTodo(todo){
  
  const schema =  {
     description: joi.string().max(80).required(),
     category : joi.string().valid('Personal','Shopping','Wishlist','Work','All'),
     priority : joi.string().valid('High','Low','Meduim'),
     isCompleted : joi.boolean(),
     user: joi.objectId().required()
  }

  return joi.validate(todo,schema)
}

module.exports.Todo = todoModel
module.exports.Validate=validateTodo

