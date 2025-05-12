const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../model/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

//Controllers
const ListingController=require("../controllers/listing.js")


//Index route
router.get("/", wrapAsync(ListingController.index));

//New route
router.get("/new", isLoggedIn,ListingController.renderNewForm);

//Show route 
router.get("/:id", wrapAsync(ListingController.show));

//Create route
router.post("/",validateListing, isLoggedIn, wrapAsync(ListingController.create));

//Edit route
router.get("/:id/edit",  isLoggedIn,wrapAsync(ListingController.edit));

//Update route
router.put("/:id",validateListing, isLoggedIn, wrapAsync(ListingController.update));

//Destroy route
router.delete("/:id",  isLoggedIn,isOwner,wrapAsync(ListingController.destroy));

module.exports=router;