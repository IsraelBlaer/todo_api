const express = require('express')
const router = express.Router()
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User, Validate,Unique } = require('../model/usermodel')
const {v4:uuidv4} = require('uuid')
const  {SendMail} =  require('../verifyemail')


let uniqueVericationToken;
//register a user into the user database
router.post('/', async (req, res) => {
    //validate the body of the request the user who wants to register sent to the server 
    const { error } = Validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    
    const isUnique = await Unique(req.body.userName)
    if(isUnique) return res.status(400).send('userName already used.')
    //check if user already exist
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('user already registered')
    

   // create user on the db 
    user = new User(
        _.pick(req.body,['userName', 'email', 'firstName', 'lastName', 'password'])
    )
   
    //hash user password and save it to the db
    console.log(user)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(user.password, salt)
    user.password = hashedPassword
    
    // save the user
    await user.save()
   
 uniqueVericationToken = uuidv4()
    
    console.log(uniqueVericationToken)
    const verObj = {
        userId: user._id,
        token : uniqueVericationToken
    }
    res.send('open the link sent to your emal to veify email for full app access')
    SendMail(req.body.email,verObj)
    
     //send the user a jsonwebtoken 
    // const token = user.generateAuthToken()
    // res.header('x-auth-token', token).send(_.pick(user, ['userName', 'email']))

})






module.exports = router

module.exports.UniqueCode = uniqueVericationToken