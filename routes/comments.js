var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");
var { isLoggedIn, checkUserCampground, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment

// COMMENTS
router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, data){
        if(err){
            console.log(err);
        } else{
            res.render("./comments/new", {campground : data});
        }
    });
});
router.post("/", isLoggedIn, function(req, res){
    Comment.create({text: req.body.text, author: {id: req.user._id, username: req.user.username}}, function(err, comment){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } else{
            Campground.findById(req.params.id, function(err, campground){
              if(err){
                 console.log(err);
                 res.redirect("/campgrounds");
                } else{
                    campground.comments.push(comment)
                    campground.save();
                    console.log("comment saved");
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id)
                }
            });
        }
    });
});

router.get("/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
        } else{
            Campground.findById(req.params.id, function(err, campground){
                if(err){
                    console.log(err);
                } else
                    res.render("./comments/edit", {campground : campground, comment : comment});
            })
        }
    });
})

router.put("/:comment_id", checkUserComment, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
        } else{
            comment.text = req.body.text;
            comment.save();
            var id = req.params.id; 
            res.redirect("/campgrounds/" + id);
        }
    });
});

router.delete("/:comment_id", checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;