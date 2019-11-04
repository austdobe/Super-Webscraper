var express = require("express");
var mongoose = require("mongoose");
var routes =require("./controllers/controller")
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



app.listen(PORT, function() {
    console.log("App running on port "+ PORT + "!");
});