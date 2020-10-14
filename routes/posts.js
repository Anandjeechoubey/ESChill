var bodyParser = require("body-parser"),
    express = require("express"),
    Post = require("../models/post"),
    router = express.Router(),
    middleware = require("../middleware"),
    app = express(),
    cors = require("cors"),
    morgan = require("morgan"),
    fileUpload = require("express-fileupload"),
    _ = require("lodash");


app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(morgan('dev'));

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
            req.flash("error","Something went wrong :(");
            res.redirect("/posts");
        } else {
            //render show template with that campground
            res.render("posts/edit", {post: foundPost});
        }
    });
});


//POST request for editing
router.put("/:id", middleware.checkUserPost,function(req,res){
    if(req.files){
        var pic = req.files.pic;
        var path = "./public/bin/" + req.user.username + pic.name;
        pic.mv(path);
    }

    var obj = {
        title : req.body.title,
        desc : req.body.desc,
        pic : "../bin/" + req.user.username + pic.name,
        author : {
            id: req.user._id,
            username: req.user.username
        }
    }
    Post.findByIdAndUpdate(req.params.id, {$set: obj}, function(err, foundPost){
        if(err){
            req.flash("error","Something went wrong :(");
            res.redirect("/posts");
        } else {
            //render show template with that campground
            req.flash("success","Updated Successfully");
            res.redirect("/posts");
        }
    });
});

//To delete a post
router.delete("/:id", middleware.checkUserPost,function(req,res){
    Post.findByIdAndRemove(req.params.id, function(err, foundPost){
        if(err){
            req.flash("error","Something went wrong :(");
            res.redirect("/posts");
        } else {
            //render show template with that campground
            req.flash("success","Deleted Successfully");
            res.redirect("/posts");
        }
    });
});

//To show a post
router.get("/:id",function(req,res){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            req.flash("error","Something went wrong :(");
            res.redirect("/posts");
        } else {
            //render show template with that campground
            res.render("posts/show", {post: foundPost});
        }
    });
});

//Add a new post to ESChill
router.post("/", middleware.isLoggedIn,function(req,res){
    
    if(req.files){
                var pic = req.files.pic;
                var path = "./public/bin/" + req.user.username + pic.name;
                pic.mv(path);
    }

    var obj = {
        title : req.body.title,
        desc : req.body.desc,
        pic : "../bin/" + req.user.username + pic.name,
        author : {
            id: req.user._id,
            username: req.user.username
        }
    }
    Post.create(obj,function(err,newPost){
        if(err){
            req.flash("error","Something went wrong :(");
            res.redirect("/posts");
        } else {
            req.flash("success","Successfully created a new post");
            res.redirect("/posts");
        }
    });
    
});

module.exports = router;