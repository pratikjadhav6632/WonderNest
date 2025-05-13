const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig.js");
const upload = multer({storage })


const ListingController = require("../controllers/listing.js") //Controllers

router.route("/")
    .get(wrapAsync(ListingController.index)) //index route
    .post( isLoggedIn,upload.single('listings[image]'),validateListing, wrapAsync(ListingController.create)); //create route
    

router.get("/new", isLoggedIn, ListingController.renderNewForm); //New route

router.route("/:id")
    .get(wrapAsync(ListingController.show)) //show route
    .put( isLoggedIn,upload.single('listings[image]'), validateListing,wrapAsync(ListingController.update)) //update route
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroy)); //destroy route

router.get("/:id/edit", isLoggedIn, wrapAsync(ListingController.edit)); //Edit route


module.exports = router;