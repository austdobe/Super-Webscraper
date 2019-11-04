var db = require("./models");
var cheerio = require("cheerio");
var axios = require("axios");


app.get("/", (req, res) => {
    db.Article.find({})
    .then((data) => {
        res.render("index", {article: data})
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
        })
        res.redirect("/")
    });
});
//Pull all the scraped data and display as Json
app.get("/all", (req, res) => {
    db.Article.find({}, (err, data)=>{
        if(err){
            console.log(err)
        }else{
            res.json(data)
        }
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
        res.redirect("/")
    })
})

app.get("/article/:id"), (req, res)=>{
    const articleId = req.params.id;

    db.Article.find({_id:articleId})
        .populate("notes")
        .exec((err, data)=>{
            if(err){
                console.log(err)

           
           }else{
               res.render("article", {article:data})
           }
        })

}