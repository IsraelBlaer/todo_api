const mongoose = require('mongoose')
const Joi = require('joi')
const joiObjectid = require('joi-objectid')
const nodemailer =  require('nodemailer')

const {CommentSchema} =  require('./commentmodel')


const sharedTodoSchema = new mongoose.Schema({

    description: {
        type: String,
        required: true,
        //  maxLength: 80
    },
    category: {
        type:String,
       enum :  ['Personal', 'Shopping', 'Wishlist', 'Work', "All"],
        default: 'All'
    },

    priority: {
        type: String,
        enum: ['High', 'Low', 'Meduim'],
        default: 'Low'
    },

    isCompleted: {
        type: Boolean,
        default: false
    },
    sendNotification: {
        type: Boolean,
        default: true
    },
    comments: [
        // {
        //     userName :  {type:String, ref: 'user' },
        //     text : {type:String }
        // }
        CommentSchema
    ],

    sharedWith: [String],
    deadlineDate: { type: Date },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
    
})


const SharedTodoModel = mongoose.model('sharedtodos', sharedTodoSchema)


function validateSharedTodo(sharedTodo) {

    const sharedTodoSchema = {
        description: Joi.string().required(),
        category : Joi.string().valid('Personal', 'Shopping', 'Wishlist', 'Work', "All").default('All'),
        priority: Joi.string().valid('High', 'Low', 'Medium'),
        isCompleted: Joi.boolean().default(false),
        sendNotification: Joi.boolean().default(true),
        sharedWith: Joi.array().items(Joi.string()),
        deadlineDate: Joi.date(),
        user: Joi.objectId().required()
    }
    
    return Joi.validate(sharedTodo, sharedTodoSchema)

}






module.exports.SharedTodo = SharedTodoModel
module.exports.validateSharedTodo = validateSharedTodo


//comments: Joi.array().items(Joi.object({user: Joi.string().required(),  text: Joi.string().required()}))

