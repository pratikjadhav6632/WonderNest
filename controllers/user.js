const User = require("../model/user.js");

//renderSignup
module.exports.renderSignup= (req, res) => {
  res.render("users/signup.ejs");
};


//Signup
module.exports.Signup=async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome to WonderNest ${username}`);
      res.redirect("/listings");
    })
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}

//renderLogin
module.exports.renderLogin= (req, res) => {
  res.render("users/login.ejs");
};


//Login
module.exports.Login=(req, res) => {
    req.flash("success", `Welcome back to WonderNest, ${req.user.username}`);
    const redirect=res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
  };

//logout
module.exports.Logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "your now logout!");
    res.redirect("/listings");
  })
};