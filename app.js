require('dotenv').config();


var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    passportLocalMongoose = require("passport-local-mongoose"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    cors = require("cors"),
    morgan = require("morgan"),
    fileUpload = require("express-fileupload"),
    _ = require("lodash"),
    flash = require("connect-flash");

//Requiring Models
var Post = require("./models/post"),
    Comment = require("./models/comment"),
    User = require("./models/user");
    //seedDB = require("./seeds");


//Requiring Routes
var postRoutes = require("./routes/posts"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index")
//mongodb://localhost:27017/eschill
//mongodb+srv://anandjee:<password>@cluster0.42jop.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DB_Url ||"mongodb://localhost:27017/eschill" , { useNewUrlParser: true });

var app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(cors());
app.use(morgan('dev'));
app.use(flash());

app.use(require("express-session")({
    secret: "I love maggi, doesn't mean that i don't love those who don't love maggi!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//seedDB();
// ============================
// Routes
// ============================
app.use("/posts/:id/comments",commentRoutes);
app.use("/posts",postRoutes);
app.use("/",indexRoutes);


// ============================
// Server
// ============================
const port = process.env.PORT || 3000 ;
app.listen(port,function(){
    console.log("Server Started!!");
});