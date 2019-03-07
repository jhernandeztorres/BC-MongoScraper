const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

// const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// mongoose.connect("mongodb://localhost/mongoHeadlines", {
//     useNewUrlParser: true
// });

// Routes

// A GET route for scraping the news.ycombinator.com website
app.get("/scrape", function(req, res) {
    // Grab the body of the site
    axios.get("https://news.ycombinator.com/").then((response) => {
        let $ = cheerio.load(response.data);

        // Grab every title in the td
        $(".storylink").each((i, element) => {
            // Save an empty result object
            let result = {};

            // console.log(response.data);
            // Add the summary, href, and text of score
            result.title = $(element).text();
            result.link = $(element).attr("href");
            console.log(result);
            // console.log(result.link);
        })
        res.send("Scrape Complete");
    })
})

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});