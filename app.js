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
const {ListingSchema ,reviewSchema}=require("./Schema.js");
const Review = require("./model/review.js")
const listing=require("./routes/listing.js");

main().then((res) => {
    console.log("Database Connected...");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(Mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));


//Review Error Handler

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((e) => e.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

app.use("/listings",listing)

//Review
//post  Route
app.post("/listings/:id/reviews", validateReview ,wrapAsync(async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing.id}`);
}));

//Delete  Route
app.delete("/listings/:id/review/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

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
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("Error/err.ejs",{message});
    // res.status(status).send(message);
});

app.listen(8080, (req, res) => {
    console.log("Listening Port 8080");
});