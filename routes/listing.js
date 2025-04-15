const express=require("express");
const router=express.Router();
const Listing = require("../model/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const {ListingSchema}=require("../Schema.js");


//validate Error Handler
const validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((e) => e.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//Index route

router.get("/", wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });

}));

//New route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
});

//Show route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//Create route
router.post("/",validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listings);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update route
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    res.redirect(`/listings/${id}`);
}));

//Destroy route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports=router;