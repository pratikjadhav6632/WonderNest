const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Mongo_url = "mongodb://127.0.0.1:27017/wonderNest"
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressErr.js");


const listing=require("./routes/listing.js");
const reviews=require("./routes/review.js");

main().then((res) => {
    console.log("Database Connected...");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(Mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));



app.use("/listings",listing);
app.use("/listings/:id/reviews",reviews);


app.get("/", (req, res) => {
    res.send('hey iam root');
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("Error/err.ejs",{message});
    // res.status(status).send(message);
});

app.listen(8080, (req, res) => {
    console.log("Listening Port 8080");
});