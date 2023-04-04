
const {Validate} = require('../model/todomodel')

module.exports= function(req,res,next){
    const { error } = Validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    next()
}