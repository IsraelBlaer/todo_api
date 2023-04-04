const user =  require('../router/user')
const login = require('../router/login')
const todo = require('../router/todo')
const sharedTodo = require('../router/sharetodo')
const errors = require('../middleware/error')

const verify = require('../router/verify')


module.exports = (app)=>{ 
    
    
    app.use((req,res,next)=>{
    console.log("authenticating")
     next()
    })
    
     
    app.use('/api/users',user)
    app.use('/api/user/verify',verify)
    app.use('/api/auth',login)
    app.use('/api/todo',todo)
    app.use('/api/sharetodo',sharedTodo)
    app.use('/api/notifications',sharedTodo)
    
    
  //  app.use(errors)
}


