const mongoose = require('mongoose');  
const mongoURI = process.env.DATABASE_ATLAS;     
mongoose.set("strictQuery", false);

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connection to MongoDb Atlas was Successfull");
    })

}

module.exports = connectToMongo;