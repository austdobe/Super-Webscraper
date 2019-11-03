var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var db = require("./models");
// Initialize Express
var app = express();
var PORT = 8000;
// Establishing Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", __dirname + '/views')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Mongo DB connection
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user:password1@ds229088.mlab.com:29088/heroku_tp7zfp5m";

mongoose.connect(MONGODB_URI);

app.get("/", function(req, res) {
    db.Article.find({})
    .then(function(data){
        
        res.render("index", {article: data});
        console.log(data)
    })
    

});

//Function to scrape information from new york times
app.get("/scrape", function(req, res){
  
    axios.get("https://www.nytimes.com/").then(function(response){

        var $ = cheerio.load(response.data);

        var results = {};

        $("article").each((i, element) => {
            //Capture link to article
            results.link = $(element).find("a").attr("href");
            //Capture the title of the article within the h2 element.
            results.title = $(element).find("h2").text() || $(element).find("h2").children().text();
          
            db.Article.create(results)
            .then((dbArticles) => {
                console.log(dbArticles);
            })
            .catch((err) => {
                console.log(err);
            });
        });

    });
});
//Pull all the scraped data and display as Json
app.get("/all", function(req, res){
    db.Article.find({}, function(err, data){
        if(err){
        console.log(err);
        }else{
        res.json(data);
        }
    });
  });
//Empty database to remove all articles
app.get("/clear", function(req, res){
    db.Article.remove({})
})

app.listen(PORT, function() {
    console.log("App running on port "+ PORT + "!");
});