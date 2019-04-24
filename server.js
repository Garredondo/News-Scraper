const express = require("express");
const mongoose = require("mongoose");

// scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// require all models
// var db = require("./")

const PORT = 3000;


// middleware to parse request body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static("public"));





// start the server
app.listen(PORT, function(){
    console.log("App running on port " + PORT + "!")
})
