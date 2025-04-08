const express = require("express");
const app = express();
const port = 8080;
const path = require('path');
const scrapeWebsite = require('./scrapeWords-puppeteer'); // Import the scraping function

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("src")); 
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

app.get("/", (req, res) => {
    res.render("index"); 
});

app.get("/urlscrape", (req, res) => {
    res.render("./URLscraping/urlscraping"); 
});

// Route to handle scraping
app.get("/scrape", async (req, res) => {
    const url = req.query.url; // Get the URL from the query parameter
    if (!url) {
        return res.status(400).send("URL is required");
    }

    try {
        const result = await scrapeWebsite(url); // Call the scraping function
        console.log(result); // Print the scraped words to the console
        res.send(result); // Send the scraped words back to the client
    } catch (error) {
        console.error("Error scraping website:", error);
        res.status(500).send("Failed to scrape the website");
    }
});

app.listen(port, () => {
    console.log("Server is listening on port", port);
});