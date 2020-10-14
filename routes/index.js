var express = require("express"),
    passport = require("passport"),
    User = require("../models/user");
var router = express.Router();

router.get("/",function(req,res){
    res.render("index");
});

router.get("/loginSuccess",function(req,res){
    req.flash("success", "Successfully logged in! Nice to meet you");
    res.redirect("posts");
});

router.get("/loginFaliure",function(req,res){
    req.flash("error", "Incorrect Username or Password!");
    res.redirect("posts");
});

router.get("/signup",function(req,res){
    res.render("signup");
});

router.post("/signup",function(req,res){
    User.register(new User({name: req.body.name ,username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully Signed Up! Nice to meet you!! " + req.body.name);
            res.redirect("/posts");
        });
    });
});
 
 //handling login logic
 router.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/loginSuccess",
         failureRedirect: "/loginFaliure"
     }), function(req, res){
 });
 
 // logout route
 router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "SUCCESSFULLY LOGGED YOU OUT!");
    res.redirect("/posts");
 });


module.exports = router;