const express = require("express");
const app = express();
const port = 8080;
const path = require('path');
const scrapeWebsite = require('./scrapeWords-puppeteer'); // Import the scraping function

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("src")); 
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

// Routes
app.get("/", (req, res) => {
    res.render("index"); 
});

app.get("/urlscrape", (req, res) => {
    res.render("./URLscraping/urlscraping"); 
});

app.get("/promptscrape", (req, res) => {
    res.render("./promptscraping/promptscraping"); 
});

app.get("/scrapedData", (req, res) => {
    const { data, url } = req.query;
    res.render("URLscraping/scrapedData", { data, url });
});

// Updated scrape route — now renders scrapedData.ejs
// app.get("/scrape", async (req, res) => {
//     const url = req.query.url;
//     if (!url) {
//         return res.status(400).send("URL is required");
//     }

//     try {
//         const data = await scrapeWebsite(url);
//         console.log("Scraped data:", data);
//         res.render("URLscraping/scrapedData", { data, url }); // pass to EJS
//     } catch (error) {
//         console.error("Error scraping website:", error);
//         res.status(500).send("Failed to scrape the website");
//     }
// });
app.get("/scrape", async (req, res) => {
    const { url, limit } = req.query;

    if (!url) return res.status(400).send("URL is required");

    try {
        const data = await scrapeWebsite(url, limit); // pass limit to scraper if needed
        res.render("URLscraping/scrapedData", { data, url });
    } catch (error) {
        console.error("Scraping failed:", error);
        res.status(500).send("Scraping failed.");
    }
});

app.listen(port, () => {
    console.log("Server is listening on port", port);
});