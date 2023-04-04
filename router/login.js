const express = require('express')
const router = express.Router()
const {User} = require('../model/usermodel')
const joi = require('joi')
const bcrypt = require('bcrypt')
const { route } = require('./todo')

const jwt = require('jsonwebtoken')


//login 
router.post('/', async (req, res) => {
  const { error } = validationAuth(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  
  let user = await User.findOne({ email: req.body.email })
  if (!user) res.status(404).send('invalid email or password')
  
  //check password :
  const isValid = await bcrypt.compare(req.body.password, user.password)
  if (!isValid) return res.status(400).send("invalid email or password")
   
  //check if user is verified before sending auth token 
  if(!user.isVerified)return res.status(400).send('verify your gmail to gain full access')
  const token = user.generateAuthToken()
 // const refreshToken = user.generateRefreshToken()
 // req.cookies=refreshToken
  res.send(token)
})




function validationAuth(user) {
  const schema = {
    email: joi.string().email({ tlds: { allow: false } }).required(),
    password: joi.string().min(10).required()
  }
  return joi.validate(user, schema)
}

module.exports =  router