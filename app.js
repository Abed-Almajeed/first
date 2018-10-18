// require and use libraries, packages and js files
var express       = require("express"),
    app           = express(),
    
    bodyParser    = require("body-parser"),
    flash         = require("connect-flash"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    passportLocal = require("passport-local"),
    methodOverride = require("method-override"),
    
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

require('dotenv').config();

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
// mongoose.connect("mongodb://abed:abed123@ds137003.mlab.com:37003/yelpcamp");
var url = mongoose.connect.DATABASEURL || "mongodb://localhost/demo" ;
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comment", commentRoutes);

// app.listen(8081, process.env.IP, function(){
//     console.log("The YelpCamp server has started!");
// });

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});
