var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport    	= require("passport"),
	LocalStrategy	= require("passport-local"),
	Katalog = require("./models/katalog"),
	User = require("./models/user");

mongoose.connect('mongodb://localhost:27017/toko', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// function seedDB(){
// 	Katalog.remove({},function(err){
// 		if(err){
// 			console.log(err);
// 		}
// 		else{
// 			console.log("removed!");
// 		}
// 	})
// }

// seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "TokoSampah",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser= req.user;
	next();
});

app.get("/", function(req, res){
	res.render("homepage");
});

//INDEX - show all catalog
app.get("/katalog", function(req, res){
	Katalog.find({}, function(err, katalog){
		if(err){
			console.log(err);
		}
		else{
			res.render("katalog/katalog", {katalog: katalog});
		}
	})
});

//CREATE - add new catalog
app.post("/katalog", function(req, res){
	var nama = req.body.nama,
		harga = req.body.harga,
		foto = req.body.foto,
		deskripsi = req.body.deskripsi,
		newKatalog = {nama: nama, harga: harga, foto: foto, deskripsi: deskripsi}
		Katalog.create(newKatalog, function(err, newlyCreated){
			if(err){
				console.log(err);
			}
			else{
				res.redirect("/katalog")
			}
		})
})

//ADD - show form to create new catalog
app.get("/katalog/add", isLogginIn, function(req, res){
	res.render("katalog/add");
});

//SHOW - show more info about one catalog
app.get("/katalog/:id", function(req, res){
	Katalog.findById(req.params.id).populate("comments").exec(function(err, foundKatalog){
		if(err){
			console.log(err);
		}
		else{
			res.render("katalog/show", {katalog: foundKatalog});
		}	
	});
});

// AUTHENTICATION

//show sign up form
app.get("/signup", function(req, res){
	res.render("signup");
});

//handle sign up logic
app.post("/signup", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("signup");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/katalog");
		})
	}); 		 
});

//show login form
app.get("/login", function(req, res){
	res.render("login");
})

//handling login logic
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/katalog", 
		failureRedirect: "/login"
	}),function(req, res){
});

//logout route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
})

//middleware
function isLogginIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function(){
	console.log("Server has Started!");
});
	
	