var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	var campgrounds = [
		{name: "Salmon Creek", image: "https://pixabay.com/get/54e6d0434957a514f6da8c7dda793f7f1636dfe2564c704c732d7dd5974ac75d_340.jpg"},
		{name: "Granite Hill", image: "https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c732d7dd5974ac75d_340.jpg"},
		{name: "Mountain Goat's Rest", image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732d7dd5974ac75d_340.jpg"}
	];
	
	res.render("campgrounds", {campgrounds: campgrounds});
});

app.listen(3000,  () => {
	console.log("Server listening on port 3000");
});

