const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewauthor}=require("../middleware.js");

//reviewController
const reviewController=require("../controllers/review.js");

//post  Route
router.post("/", validateReview,isLoggedIn, wrapAsync(reviewController.post));

//Delete  Route
router.delete("/:reviewId",isLoggedIn,isReviewauthor,wrapAsync(reviewController.delete));

module.exports=router;