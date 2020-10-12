var express = require("express"),
    passport = require("passport"),
    User = require("../models/user");
var router = express.Router();

router.get("/",function(req,res){
    res.render("index");
});

router.get("/signup",function(req,res){
    res.render("signup");
});

router.post("/signup",function(req,res){
    User.register(new User({name: req.body.name ,username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.send("Galti kr diye ho be:");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/posts");
        });
    });
});
 
 //handling login logic
 router.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/posts",
         failureRedirect: "/"
     }), function(req, res){
 });
 
 // logout route
 router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/posts");
 });


module.exports = router;