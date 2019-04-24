const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// require all models
// var db = require("./models");

const PORT = 3000;

// initialize Express
const app = express();

// config middleware
    // morgan logger for logging requests
app.use(logger("dev"));
    // middleware to parse request body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
    // set public as a static folder
app.use(express.static("public"));

// handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout : "main" }));
app.set("view engine", "handlebars");

// connect to Mongo DB

mongoose.connect("mongodb://localhost/_dbNAME", { useNewUrlParser : true});

// routes


// start the server
app.listen(PORT, function(){
    console.log("App running on port " + PORT + "!")
})
