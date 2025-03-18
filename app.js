const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Mongo_url="mongodb://127.0.0.1:27017/wonderNest"
const Listing=require("./model/listing.js")
const path=require("path");


main().then((res)=>{
    console.log("Database Connected...");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_url);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
//Index route
app.get("/listings",async(req,res)=>{
   let allListing= await Listing.find({});
    res.render("listings/index.ejs",{allListing});

})
//Show route 
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})
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