const Listing = require("../model/listing.js");

//index route
module.exports.index=async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};

//new route
module.exports.renderNewForm=(req, res) => {
        res.render("listings/new.ejs")
};

//show route
module.exports.show=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    res.render("listings/show.ejs", { listing });
};

//create route
module.exports.create=async (req, res, next) => {
    const newListing = new Listing(req.body.listings);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New listing added!");
    res.redirect("/listings");
};

//Edit route
module.exports.edit=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

//update route

module.exports.update=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
};

//Destroy route
module.exports.destroy=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
};