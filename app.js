const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Mongo_url = "mongodb://127.0.0.1:27017/wonderNest"
const Listing = require("./model/listing.js")
const path = require("path");
const methodOverride=require("method-override");
const engine=require("ejs-mate");
const ExpressError=require("ExpressError")


main().then((res) => {
    console.log("Database Connected...");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(Mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",engine);
app.use(express.static(path.join(__dirname,"/public")));

//Index route
app.get("/listings", async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });

})

//New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

//Show route 
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
})

//Create route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listings);
    newListing.save();
    res.redirect("/listings");
})

//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//Update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listings});
    res.redirect("/listings");
})

//Destroy route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

//Testing route
/*app.get("/test",async (req,res)=>{
    let sampledata=new Listing({
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

app.get("/", (req, res) => {
    res.send('hey iam root');
})

app.listen('8080', (req, res) => {
    console.log("Listening Port 8080");
})