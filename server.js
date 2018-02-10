var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//require all models
var db = require("./models");

var PORT = 3000;

//Initializing Express
var app = express();

//Configuring middleware

//using morgan logger to log requests
app.use(logger("dev"));
//using body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false}));
//using express.static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/kc-star-scraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI)



/////////////////////////////////////////////////////////
/////////////////////////ROUTES//////////////////////////
/////////////////////////////////////////////////////////

//A GET route for scraping the kc star website
app.get("/scrape", function(req, res) {
	//grab the body of the html with the request
	axios.get("https://www.kansascity.com/news").then(function(response) {
		//load that into cheerio and saving it to $ for a shorthand selector
		var $ = cheerio.load(response.data);
		//grabbing every h4 within an article tag
		$("article .teaser").each(function(i, element) {
			//saving the result in an empty object
			var result = {};
			//adding the text, summary and href of every link and saving them as properties of the object
			result.title = $(this)
				.children("h4")
				.text();
			result.summary = $(this)
				.children("p")
				.text();
			result.link = $("h4")
				.children("a")
				.attr("href");

				//create a new Article using the 'result' object built from scraping
				db.Article
					.create(result)
					.then(function(dbArticle) {
						//if able to successfully scrape and save an Article, a message will be sent to the client
						res.send("Scrape complete!");
					})
					.catch(function(err) {
						//if an error occured, send it to the client
						res.json(err);
					});
		});
	});
});

//Route for getting all Articles from the db
app.get("/articles", function(req, res) {
	//grabbing every document in the Articles collection
	db.Article
		.find({})
		.then(function(dbArticle) {
				//if able to successfully find Articles, send them back to the client
				res.json(dbArticle);		
		})
		.catch(function(err) {
			//if an error occured, also send that to the client
			res.json(err);
		});
});

//Route for grabbing a specific Article by id, and populating it with it's note
app.get("/articles/:id", function(req, res) {
	//using the id passed in the id parameter, preparing a query that finds the matching one from the db
		db.Article
			.findOne({ _id: req.params.id })
			//and populate all fo the notes associated with it
			.populate("note")
			.then(function(dbArticle) {
				//if we are able to successfully find an Article with the given id, send it back to the client
				res.json(dbArticle);
			})
			.catch(function(err) {
				//if an error occured, send it to the client
				res.json(err);
			});
});

//Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
	//create a new note and pass the req.body to the entry
	db.Note
		.create(req.body)
		.then(function(dbNote) {
			//If a Note was created successfully, find one Article with an '_id' equal to 'req.params.id' Update the Article to be associated with the new Note
			//{ new:true } tells the query that we want it to retun the updated User -- it returns the original by default
			//Because the mongoose query returns a promise, we will chain another '.then' which receives the result of the query
			return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote_id }, { new:true });
		})
		.then(function(dbArticle) {
			//if able to successfully update an Article, send it back to the client
			res.json(dbArticle);
		})
		.catch(function(err) {
			//if an error occured, send it back to the client
			res.json(err);
		});
});

//Starting the server
app.listen(PORT, function() {
	console.log("The magic is happening on " + PORT + "!");
});
