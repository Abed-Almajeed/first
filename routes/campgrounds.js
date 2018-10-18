var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");
var { isLoggedIn, checkUserCampground, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
var geocoder = NodeGeocoder(options);

// View Campgrounds
router.get("/", function (req, res) {
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
        Campground.count().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                var page = "campgrounds";
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage),
                    page: page
                });
            }
        });
    });
});

// Add Campground
router.get("/new", isLoggedIn, function(req, res) {
    res.render("./campgrounds/new");
});

router.post("/", isLoggedIn, function(req, res){
    var author = { id: req.user._id , username: req.user.username } ;
   geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: req.body.name, author : author, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Campground.create(newCampground, function(err, data){
        if (err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
   });
});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, data){
        if(err){
            console.log(err);
        } else{
            res.render("./campgrounds/show", {campground: data});
        }
    });
});

router.get("/:id/edit", function(req, res) {
    Campground.findById(req.params.id, function(err, data){
        if(err){
            console.log(err);
        } else {
            var campground = data;
            res.render("./campgrounds/edit", {campground : campground});
        }
    })
})

router.put("/:id", checkUserCampground, function(req, res) {
  geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, newData, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

router.delete("/:id", checkUserCampground, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
    
});


module.exports = router;