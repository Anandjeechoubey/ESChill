var express = require("express"),
    bodyParser = require("body-parser"),
    Post = require("../models/post"),
    Comment = require("../models/comment"),
    middleware = require("../middleware"),
    router = require("./posts");
    router = express.Router({mergeParams: true});

//POST req for new comment
router.post("/", middleware.isLoggedIn,function(req, res){
    //lookup campground using ID
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
            res.redirect("/posts");
        } else {
         Comment.create(req.body.comment, function(err, newComment){
            if(err){
                console.log(err);
            } else {
                //add username and id to comment
                newComment.author.id = req.user._id;
                newComment.author.username = req.user.name;
                //save comment
                newComment.save();
                post.comments.push(newComment);
                post.save();
                // req.flash('success', 'Created a comment!');
                res.redirect('/posts/' + post._id);
            }
         });
        }
    });
 });

//Form for a new comment
router.get("/new",  middleware.isLoggedIn,function(req, res){
    Post.findById(req.params.id,function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("comments/new", {post: foundPost});
        }
    });
});

router.get("/:commentId/edit",  middleware.checkUserComment,function(req, res){
    Comment.findById(req.params.commentId,function(err, foundComment){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("comments/edit", {post_id: req.params.id, comment: foundComment});
        }
    });
});


router.put("/:commentId", middleware.checkUserComment, function(req,res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
        if(err){
            res.send("error");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

router.delete("/:commentId", middleware.checkUserComment, function(req,res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
        if(err){
            res.send("error");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});



module.exports = router;