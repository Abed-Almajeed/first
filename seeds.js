var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

var newCampgrounds = [
{
    name: "Sun" ,
    image: "https://t-ec.bstatic.com/images/hotel/max1024x768/203/20348012.jpg" ,
    description: "Birds are so lovely!"
},{
    name: "Sea" ,
    image: "http://parkbridgehomes.com/wp-content/uploads/2016/11/20160428_150445-1-1024x578.jpg" ,
    description: "I love baech"
},{
    name: "Trees" ,
    image: "https://numundo.imgix.net/Hy-IOmwOb/rJx_qYC_W/rkex_5tAuW/1503726802.jpg" ,
    description: "Trees is so buetiful"
}];

function seedDB(){
    Campground.deleteMany({}, function(err){
        if(err){
            console.log("failed to remove campgrounds.");
        }
        newCampgrounds.forEach(function(campground){
            Campground.create(campground, function(err,camp){
                if(err){
                    console.log(err);
                } else{
                    console.log("created a campground!");
                    Comment.create({text: "The campground have many adventurs.", author: "Abed"}, function(err, comment){
                        if(err){
                            console.log("failed to create comment");
                        } else {
                            camp.comments.push(comment)
                            camp.save();
                            console.log("Comment saved!");
                        }
                    });
                }
            });
        });
    });
};

module.exports = seedDB;
