var bodyParser = require("body-parser"),
    express = require("express"),
    Post = require("../models/post"),
    router = express.Router(),
    middleware = require("../middleware"),
    app = express();


app.use(bodyParser.urlencoded({extended: true}));

// To show all the posts
router.get("/",function(req,res){
    Post.find({}, function(err, allPosts){
        if(err){
            console.log(err);
        } else {
            res.render("posts",{ allposts: allPosts});
        }
        
    });
    
});

// To create a new post
router.get("/new", middleware.isLoggedIn,function(req,res){
    res.render("posts/new");
});

// To edit own post
router.get("/:id/edit", middleware.checkUserPost,function(req,res){
    Post.findById(req.params.id,function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("posts/edit", {post: foundPost});
        }
    });
});


//POST request for editing
router.put("/:id", middleware.checkUserPost,function(req,res){
    Post.findByIdAndUpdate(req.params.id, {$set: req.body.post}, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.redirect("/");
        }
    });
});

//To delete a post
router.delete("/:id", middleware.checkUserPost,function(req,res){
    Post.findByIdAndRemove(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.redirect("/");
        }
    });
});

//To show a post
router.get("/:id",function(req,res){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("posts/show", {post: foundPost});
        }
    });
});

//Add a new post to ESChill
router.post("/", middleware.isLoggedIn,function(req,res){
    req.body.post.author = {
        id: req.user._id,
        username: req.user.username
    }
    Post.create(req.body.post,function(err,newPost){
        if(err){
            console.log(err);
        } else {
            res.redirect("/posts");
        }
    });
    
});

module.exports = router;