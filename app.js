const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Mongo_url = "mongodb://127.0.0.1:27017/wonderNest"
const Listing = require("./model/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErr.js");
const {ListingSchema}=require("./Schema.js");
const Review = require("./model/review.js")

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
app.use(express.json()); 
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));


//validate Error Handler
// const validateErr = (req, res, next) => {
//     console.log("Incoming Request Body:", req.body);
//     let { error } = ListingSchema.validate(req.body.listings);
//     if (error) {
//         let errMsg = error.details.map((e) => e.message).join(", ");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };



//Index route

app.get("/listings", wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });

}));

//New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
});

//Show route 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

//Create route
app.post("/listings", wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listings);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    res.redirect(`/listings/${id}`);
}));

//Destroy route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Review Route
app.post("/listings/:id/reviews",async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("review saved successfully");
    res.redirect(`/listings/${listing.id}`);
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

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("Error/err.ejs",{message});
    // res.status(status).send(message);
});

app.listen(8080, (req, res) => {
    console.log("Listening Port 8080");
})