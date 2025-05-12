const express=require("express");
const router=express.Router({mergeParams:true});
const Listing = require("../model/listing.js")
const Review = require("../model/review.js")
const ExpressError = require("../utils/ExpressErr.js");;
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn}=require("../middleware.js");


//post  Route
router.post("/", validateReview,isLoggedIn, wrapAsync(async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review added !");
    res.redirect(`/listings/${listing.id}`);
}));

//Delete  Route
router.delete("/:reviewId",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted ");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;