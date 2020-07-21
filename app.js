var express      = require("express"),
	bodyParser   = require("body-parser"),
	mongoose	 = require("mongoose"),
	methodOverride= require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	User			= require("./models/user"),
	passportLocalMongoose = require("passport-local-mongoose"),
	app 		 = express();
//APP CONFIG
mongoose.connect("mongodb-Cluster");
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body : String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema); 

//PASSPORT CONFIGURATION


app.use(require("express-session")({
	secret: "testing",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req , res , next){
	res.locals.currentUser = req.user;
	next();
});


//RESTFUL ROUTES    

app.get("/", function(req,res){
	res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR");
		}
		else {
			res.render("index", {blogs:blogs});
		}
	});
});

//NEW ROUTE
app.get("/blogs/new",isLoggedIn, function(req, res){
	res.render("new");
});


//CREATE ROUTE
app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);

	Blog.create(req.body.blog, function(err, newBlog){
		if (err) {
			res.render("new");
		} else{
				res.redirect("/blogs");
		}
	});
});
//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
		res.redirect("/blogs");
		} else{
			res.render("show" , {blog : foundBlog});
		}
	});
}); 

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err ,foundBlog){
		if (err) {
			res.redirect("/blogs");
		} else{
			res.render("edit", {blog : foundBlog});
		}
	});
	
});
//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	
	Blog.findByIdAndUpdate(req.params.id, req.body.blog ,function(err,updateBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});
//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
	//res.send("deleted");
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	});
});



//AUTH ROUTES

//show register form
app.get("/register", function(req, res){
	res.render("register");
});
//handle sign up logic
app.post("/register" , function(req , res){
var newUser = new User({username: req.body.username});
User.register(newUser, req.body.password, function(err , user){
	if(err){
		console.log(err);
		return res.render("register");
	}
	passport.authenticate("local")(req , res , function(){
		res.redirect("/blogs");
	});
});
});

// show login page
app.get("/login" , function(req , res){
	res.render("login");
});

//handle login logic
app.post("/login" ,passport.authenticate("local",
	{  
		successRedirect: "/blogs",
		failureRedirect: "/login"

	}) ,function(req , res){

});



//logout route
app.get("/logout" , function(req, res){
	req.logout();
	res.redirect("/blogs");
});

function isLoggedIn(req , res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	res.redirect("/login");
	
} 




app.listen(3000, function () {
	console.log("server started");
});
