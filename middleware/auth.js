
const jwt = require('jsonwebtoken')
const config =  require('config')


module.exports = function (req,res,next){
   const token = req.header('x-auth-token')
   if(!token) return res.status(401).send('unauthorized access')
    
   try{
    const decoded =  jwt.verify(token,config.get('jwtPrivateKey'))
    req.user = decoded
    req.body.user =  decoded._id
    next()
   }
   
   catch(ex){
    if (ex.name === 'TokenExpiredError') {
        // If the token has expired, return a 401 Unauthorized response
        return res.status(401).send('Token expired');
      } else {
        // If the token is invalid for other reasons, return a 401 Unauthorized response
        return res.status(401).send('Invalid token');
      }
   }

//     return  ex.name==='TokenExpiredError'
//    ?   res.status(401).send('Token expired')
//    :   res.status(401).send('Invalid token');
   
}