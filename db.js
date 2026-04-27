const mongoose =require("mongoose");

var url='mongodb://127.0.0.1:27017/mern-pizza'

mongoose.connect(url,{useUnifiedTopology:true,useNewUrlParser:true})

var db=mongoose.connection

db.on('connected',()=>{
    console.log("mongodb Connection succefull");
})
db.on('error',()=>{
    console.log("mongo db connection failed");
})

module.exports = mongoose