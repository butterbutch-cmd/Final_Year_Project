const mongoose = require('mongoose')

module.exports = ()=>{
    try{
        mongoose.connect(process.env.DB);
        console.log("Connected to the mongoDB");        
    }catch(error){
        console.log(error);
        console.log("Could not connect with the mongoDB");
        
    }
}