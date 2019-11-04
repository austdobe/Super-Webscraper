var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var db = require("./models");
// Initialize Express
var app = express();
var PORT = process.env.PORT || 8000;
// Establishing Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", __dirname + '/views')
app.set("partials", __dirname + '/partials')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Mongo DB connection
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user:password1@ds229088.mlab.com:29088/heroku_tp7zfp5m";

mongoose.connect(MONGODB_URI);

app.get("/", (req, res) => {
    db.Article.find({})
    .then((data) => {
        
        res.render("index");
        console.log(data)
    })
    

});


//Function to scrape information from new york times
app.get("/scrape", (req, res) => {
    var results = {};
    axios.get("https://www.nytimes.com/").then((response) => {
        
        var $ = cheerio.load(response.data);
        
        $("article").each((i, element) => {
            //Capture link to article
            results.link = "https://www.nytimes.com" + $(element).find("a").attr("href");
            //Capture the title of the article within the h2 element.
            results.title = $(element).find("h2").text() || $(element).find("h2").children().text();
            results.summary = $(element).find("li").text() || $(element).find("p").text();

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
app.get("/all", (req, res) => {
    db.Article.find({})
    .then((data)=>{
        res.render("index", {article: data})
        console.log(data)
    })
    .catch((err)=>{
        console.log(err)
    })
});

app.get("/saved", (req, res) => {
    db.Article.find({isSaved})
    .then((data)=>{
        res.render("index", {article: data})
        console.log(data)
    })
    .catch((err)=>{
        console.log(err)
    })
});
//Empty database to remove all articles
app.get("/clear", (req, res) => {
    db.Article.collection.drop()
    .then(()=>{
        res.render("index")
    })
})

app.listen(PORT, function() {
    console.log("App running on port "+ PORT + "!");
});