var Comment = require("../models/comment");
var Post = require("../models/post");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/posts");
    },
    checkUserPost: function(req, res, next){
        if(req.isAuthenticated()){
            Post.findById(req.params.id, function(err, post){
               if(post.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   console.log("BADD!!!");
                   res.redirect("/posts/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("/posts");
        }
    },
    checkUserComment: function(req, res, next){
        console.log("YOU MADE IT!");
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
               if(comment.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("/posts/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("posts");
        }
    }
}