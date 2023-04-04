const mongoose =  require('mongoose')
const joi =  require('joi')



const commentSchema = new mongoose.Schema({
    
        userName : {
            type : String,
            ref : 'user'
        } ,
        text : {
         type: String,
         required:true
        }
    
})


const comment =  mongoose.model('comment',commentSchema)

function validateComment(comment){
   const schema = {
    userName : joi.string(),
    text: joi.string().required()
}

return joi.validate(schema,comment)

}

module.exports.CommentSchema =  commentSchema
module.exports.Comment  =  comment
module.exports.Validate = validateComment

