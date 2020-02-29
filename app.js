var express    = require("express"),
	app        = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	Campground = require("./models/campground"),
	seedDB     = require("./seeds"),
	Comment    = require("./models/comment");
	//User    = require("./models/user");

// Mongoose deprecation:
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

// Connect to the mongodb database
mongoose.connect("mongodb://localhost/yelp_camp");

// For the requests we receive to have a "req.body" that we can access:
app.use(bodyParser.urlencoded({extended:true}));

// The pages that we render (in our routes) will always be ejs. We set that where
// so that we don't have to write ".ejs" all the time afterwards
app.set("view engine", "ejs");

// Connect the stylesheet were we write custom css:
app.use(express.static(__dirname + "/public"));
// where __dirname represents the directory that the script is running on
// Now that we've pointed out to this directory where all the css live, we import the sheet through
// a <link> in our header.html

// Initialize with seed
seedDB();

var campgrounds = [
		{name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__480.jpg"},
		{name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242__480.jpg"},
		{name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2018/02/05/13/15/caravan-3132180__480.jpg"}
];

app.get("/", function(req, res){
	res.render("landing");
});

// INDEX route -- show all campgrounds
app.get("/campgrounds", function(req, res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

// CREATE - add new campground to database
app.post("/campgrounds", function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc}
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// =============
// Comments Routes
// =============

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground})
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
			
		}
	});
});



app.listen(3000,  () => {
	console.log("Server listening on port 3000");
});

