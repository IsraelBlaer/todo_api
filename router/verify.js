
const express = require('express')
const router = express.Router()
const { User, Validate,Unique } = require('../model/usermodel')
const  {UniqueCode} =  require('./user')








router.get('/:userId/:token',async(req,res)=>{
    const user = await User.findOne({_id:req.params.userId})
    if(!user) return res.status(400).send('invalidLink')
    if(!req.params.token===UniqueCode) return res.status(400).send('invalid link')
    user.isVerified=true;
    user.save()
    
   //  send the user a jsonwebtoken
     const token = user.generateAuthToken()
     res.header('x-auth-token', token) //.send(_.pick(user, ['userName', 'email']))
    return res.status(200).send('verified sucessfully')  
})




module.exports=router