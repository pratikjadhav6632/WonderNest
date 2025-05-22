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
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listings);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing added!");
    res.redirect("/listings");
};

//Edit route
module.exports.edit=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){

        req.flash("error","Listing your req for does not exist")
        res.redirect("/listings");
    }
    let originalImgUrl=listing.image.url;
   let dem=originalImgUrl.replace("/upload","/upload/h_200,w_300");
    res.render("listings/edit.ejs", { listing,dem});
};

//update route

module.exports.update=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    if(typeof req.file !== "undefined"){
     let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }

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