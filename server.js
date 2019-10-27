var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "mongoHeadlines";
var collections = ["scrapedData", "savedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

//Function to scrape information from new york times
app.get("/scrape", function(req, res){
  
    axios.get("https://www.nytimes.com/").then(function(response){

        var $ = cheerio.load(response.data);

        var results = [];

        $("article").each(function(i, element){
            //Capture link to article
            var link = $(element).find("a").attr("href");
            //Capture the title of the article within the h2 element.
            var title = $(element).find("h2").text();
            //Some of the h2 elements are not filled or are null. If statment is used to change title to span within the h2 elements.
            if(title === null || title === ""){
                title = $(element).find("h2").children().text();
            }
            //Capture the summary of the article.
        

            //Push the information into an array to get later.
            results.push({
                link: link,
                title: title

            });
        
        });

        db.scrapedData.insert(results);
        console.log("data Scraped");
    });
});
//Pull all the scraped data and display as Json
app.get("/all", function(req, res){
    db.scrapedData.find({}, function(err, data){
        if(err){
        console.log(err);
        }else{
        res.json(data);
        }
    });

});

app.listen(8000, function() {
    console.log("App running on port 8000!");
});