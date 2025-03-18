const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Mongo_url="mongodb://127.0.0.1:27017/wonderNest"
const listing=require("./model/listing.js")

main().then((res)=>{
    console.log("Database Connected...");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_url);
}

//Testing route
/*app.get("/test",async (req,res)=>{
    let sampledata=new listing({
        title:"AC Room",
        description:"demo description",
        location:"pune",
        country:"India"
    })
   await sampledata.save().then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    });
    console.log(sampledata);
    res.send("test successfull...");
})*/

app.get("/",(req,res)=>{
    res.send('hey iam root');
})

app.listen('8080',(req,res)=>{
    console.log("Listening Port 8080");
})