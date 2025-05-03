const express=require("express");
const router=express.Router({mergeParams:true});
const Listing = require("../model/listing.js")
const Review = require("../model/review.js")
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const {reviewSchema}=require("../Schema.js");

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

//post  Route
router.post("/", validateReview ,wrapAsync(async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review added !");
    res.redirect(`/listings/${listing.id}`);
}));

//Delete  Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted ");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;