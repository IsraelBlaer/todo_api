const mongoose = require('mongoose')

const notificationModel =  new mongoose.Schema({
    message  : {
        type : String
    },
    read : {
        type:Boolean,
        default : false
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    createdAt: {
        type: Date,
        default : Date.now
    }

})

const Notification = mongoose.model('notifications',notificationModel)

module.exports.MyNotification =  Notification
