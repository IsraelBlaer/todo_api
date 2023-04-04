

module.exports = async function handleRouteError(err,req,res,next){
   res.status(500).send('internal serval error,something failed')           
}


