const express =  require('express')
require('express-async-errors')
const config = require('config')
const app =  express()



if(!config.get('jwtPrivateKey')){

    try{
        throw new Error('FATAL ERROR : jwt private key not defined')
    }
    catch(e){
        console.log(e.message)
    }
   
}


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))



require('./startup/database')()
require('./startup/router')(app)





const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)
})

