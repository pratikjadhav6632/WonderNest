const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js")


router.route("/signup") //Signup route
  .get(userController.renderSignup)
  .post(wrapAsync(userController.Signup));

router.route("/login") //Login route
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.Login
  );

router.get("/logout", userController.Logout); //Logout route
 
module.exports = router;