var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


// Home Page Route
router.get("/", function(req, res){
    res.render("landing");
});

// ====================   
// Authorization Routes
// ====================

// show register form
router.get("/signup", function(req, res){
  res.render("signUp", {page: "signup"}); 
});
//handle sign up logic
router.post("/signup", function(req, res){
    var newUser = new User({username: req.body.username});
    if (req.body.admineCode == "1234"){
        newUser.isAdmine = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signUp", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds"); 
        });
        
    });
});

// show login form
router.get("/login", function(req, res){
  var page = "login";
  res.render("login", {page: page}); 
});

// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        successFlash: 'Welcome to YelpCamp!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});


module.exports = router;
