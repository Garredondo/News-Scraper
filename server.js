const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// require all models
var db = require("./models");

const PORT = 3000;

// initialize Express
const app = express();

// config middleware
// morgan logger for logging requests
app.use(logger("dev"));
// middleware to parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// set public as a static folder
app.use(express.static("public"));

// connect to Mongo DB

// this is is the code from the instructions updated with my database?
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nprscraper";

mongoose.connect(MONGODB_URI);

// this is my original connection... 
// mongoose.connect("mongodb://localhost/nprscraper", { useNewUrlParser: true });

// this is directly from the hw instructions
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// routes

// scrape for articles
app.get("/scrape", function (req, res) {
    axios.get("http://www.npr.org/sections/news/archive").then(function (response) {
        // needed for cheerio
        var $ = cheerio.load(response.data);

        $("div.item-info").each(function (i, element) {

            var result = {};

            result.title = $(this)
                .children("h2.title")
                .find("a")
                .text();
            result.description = $(this)
                .children("p.teaser")
                .find("a")
                .text();
            result.url = $(this)
                .children("p.teaser")
                .children("a")
                .attr("href");

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                }).catch(function (err) {
                    console.log(err);
                });

        });
        res.send("Scrape Complete");
    });
});

// display all the articles
app.get("/", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        
        var articleObj = {
            articles: dbArticle
        };
        res.render("index", articleObj);
        
    }).catch(function (err) {
        res.json(err);
    });
});

// save article 
app.put("/save/:id", function(req, res){
    var id = req.params.id;
    console.log(id);
    db.Article.findOneAndUpdate({"_id" : id}, {$set : {"saved" : true}})
        .then(function(data){
            console.log(data);
        }).catch(function(err){
            console.log(err);
        });
    res.send("Saved");
});


// NEED TO WORK ON THE FOLLOWING>>>>

// app.get("/articles/:id", function (req, res) {
//     db.Article.findOne({ _id: req.params.id }).populate("note").then(function (dbArticle) {
//         var articleObj = {
//             articles: dbArticle
//         };
//         res.render("index", articleObj);
//     }).catch(function (err) {
//         res.json(err);
//     });
// });

app.post("/articles/:id", function (req, res) {
    console.log(req.body);
    db.Note.create(req.body).then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    }).then(function (dbArticle) {
        res.render(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

// app.delete("/articles/:id", function (req, res) {
//     db.Note.remove(req.body).then(function (dbNote) {
//         return db.dbArticle.findOneAndRemove({ _id: req.params.id });
//     }).then(function (dbArticle) {
//         res.json(dbArticle);
//     }).catch(function (err) {
//         res.json(err);
//     });
// });

// start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!")
});