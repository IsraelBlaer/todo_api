const joi  = require('joi')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const config =  require('config')


const userSchema =  new mongoose.Schema(
    {   
        firstName :{type: String, required:true},
        lastName : {type: String, required:true},
        userName : {
            type:String,
            require: true,
            minLenth:5,
            unique : true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: props => `${props.value} is not a valid email address.`
          },
          isVerified :{
             type: Boolean,
             default : false
          },
         isAdmin : {
            type :Boolean,
            default: false
         },
         password : {
            type:String,
            minLenth:10,
            required:true,

         }
    }
 
)

userSchema.methods.generateAuthToken = function (){
 const token =  jwt.sign({_id:this._id, isAdmin:this.isAdmin,email:this.email},config.get('jwtPrivateKey'),{expiresIn: '1h'})
 return token 
}

// userSchema.methods.generateRefreshToken =  function(){
//   const token =  jwt.sign({_id:this._id, isAdmin:this.isAdmin, email: this.email},config.get('jwtPrivateKey'),{expiresIn: '1d'})
//   return token
// }


const User = mongoose.model('user',userSchema)



function validateUser(user){
  
 const schema = {
   userName: joi.string().min(5).required(),
   firstName : joi.string().required(),
   lastName : joi.string().required(),
   password : joi.string().min(10).required(),
   email: joi.string().email({ tlds: { allow: false } }).required()
 }
 
 return joi.validate(user,schema)
  
}

async function isUnique(userName){
  let user = await User.findOne({userName})
  if(user) return true 
}


module.exports.User = User
module.exports.Unique = isUnique
module.exports.Validate = validateUser

