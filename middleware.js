const ExpressError = require("./utils/ExpressErr.js");
const {reviewSchema}=require("./Schema.js");
const Review = require("./model/review.js");
const Listing = require("./model/listing.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl=req.originalUrl;
    req.flash("error", "You must be logged in to create a new listing.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","your are not the Owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewauthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","your are not the author of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

//Review Error Handler
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((e) => e.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//validate Error Handler
module.exports.validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((e) => e.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

