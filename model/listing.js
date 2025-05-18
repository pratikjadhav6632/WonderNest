const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true  // Ensure title is always required
    },
    description: {
        type: String
    },
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
        default: 1000
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    ,
    category: {
        type: String,
        enum: ["Trending",
            "Cities",
            "Hilltops",
            "Beach",
            "Lakeside",
            "Forest",
            "Pool",
            "Cold Stays",
            "Camping",
            "Luxury",
            "Pet Friendly",
            "Entire Place",
            "Cabins"],
        required: true
    }
});

listingSchema.post("findOneAndDelete", async (Listing) => {
    if (Listing) {
        await Review.deleteMany({ _id: { $in: Listing.reviews } })
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
