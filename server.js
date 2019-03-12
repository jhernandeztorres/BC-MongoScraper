const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Routes

// Route for getting all articles from database
app.get("/", function (req, res) {
    db.Article.find({
            saved: false
        })
        .then(function (dbArticle) {
            res.render("index", {
                article: dbArticle
            });
        })
        .catch(err => {
            console.log(err)

        })
})

// A GET route for scraping the news.ycombinator.com website
app.get("/scrape", function (req, res) {
    // Grab the body of the site
    axios.get("https://news.ycombinator.com/").then((response) => {
        let $ = cheerio.load(response.data);

        // Grab every title in the td
        $(".storylink").each((i, element) => {
            // Save an empty result object
            let result = {};

            // Add the summary, href, and text of score
            result.title = $(element).text();
            result.link = $(element).attr("href");
            console.log(result);

            // Create new Article using the result object
            db.Article.create(result)
                .then((dbArticle) => {
                    console.log(dbArticle);
                    // res.redirect("/")

                })
                .catch((err) => {
                    console.log(err);
                });
        });
    })
})

// Route for getting all articles that are saved
app.get("/saved", (req, res) => {
    db.Article.find({
            saved: true
        })
        .then((dbArticle) => {
            res.render("saved", {
                article: dbArticle
            })
        })
        .catch((err) => {
            res.json(err);
        });
});

// Route for setting article to saved
app.put("/saved/:id", (req, res) => {
    db.Article.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        }).then((dbArticle) => {
            res.render("saved", {
                article: dbArticle
            });
        })
        .catch((err) => {
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", (req, res) => {
    db.Article.findOne({_id: req.params.id})
    .populate("note").then((dbArticle) => {
            res.json(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
});

// Route for saving/updating an Article's note
app.post("/articles/:id", (req, res) => {
    db.Note.create(req.body)
        .then((dbNote) => {
            return db.Article.findByIdAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            })
        })
        .then((dbArticle) => {
            res.json(dbArticle)
        })
        .catch((err) => {
            res.json(err);
        });
});

// Route for getting all notes for specific article
app.get("/notes/:id", (req,res) => {
    db.Note.findById({_id: req.params.id})
    .populate("note").then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});