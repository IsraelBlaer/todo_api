const mongoose = require('mongoose')
const uri =  "mongodb://127.0.0.1/note_v2"


module.exports = () => {
    
    mongoose.connect(uri)
        .then(() => { console.log('mongoose connected') })
        .catch((e) => { console.log('mongoose failed to connect', e) })
}


