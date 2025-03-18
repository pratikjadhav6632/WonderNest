const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Mongo_url="mongodb://127.0.0.1:27017/wonderNest"
const listing=require("listing")

main().then((res)=>{
    console.log("Database Connected...");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_url);
}

app.get("/",(req,res)=>{
    res.send('hey iam root');
})

app.listen('8080',(req,res)=>{
    console.log("Listening Port 8080");
})