require('dotenv').config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Mongo_url =process.env.ATLAS_URL;
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressErr.js");
const session = require("express-session");
const Mongo_store=require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");


const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");
const { error } = require('console');

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

const store=Mongo_store.create({
    mongoUrl:Mongo_url,
    crypto:{
         secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600

})

store.on("error",()=>{
    console.log("Error in Mongo_session",error);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demoUser",async(req,res)=>{
//     const fakeUser=new User({
//         email:"edmo@gmail.com",
//         username:"Demo12"
//     });
//     let registeredUser=await User.register(fakeUser,"Abc123");
//     res.send(registeredUser);
// })

app.use("/listings", listing);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("Error/err.ejs", { message });
    // res.status(status).send(message);
});

app.listen(8080, (req, res) => {
    console.log("Listening Port 8080");
});