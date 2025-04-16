const express = require("express");
const app = express();
const port = 8080;
const path = require('path');
const scrapeWebsite = require('./scrapeWords-puppeteer'); // Import the scraping function
const convertText = require('./textprocessai');
const bodyParser = require('body-parser');
const convertText_prompt = require('./scrapingwithprompt_script');



app.use(express.json()); 
app.use(bodyParser.json()); 

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
app.get("/datasettext", (req, res) => {
    res.render("./Dataset/text.ejs"); 
});
app.get("/datasetimage", (req, res) => {
    res.render("./Dataset/image.ejs"); 
});
app.get("/datasetaudio", (req, res) => {
    res.render("./Dataset/audio.ejs"); 
});

app.get("/scrapedData", (req, res) => {
    const { data, url } = req.query;
    res.render("URLscraping/scrapedData", { data, url });
});

// Updated scrape route — now renders scrapedData.ejs
app.get("/scrape", async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send("URL is required");
    }

    try {
        const data = await scrapeWebsite(url);
        console.log("Scraped data:", data);
        res.render("URLscraping/scrapedData", { data, url }); // pass to EJS
        // res.json({ output });
    } catch (error) {
        console.error("Error scraping website:", error);
        res.status(500).send("Failed to scrape the website");
    }
});
app.post('/scrapePrompt', async (req, res) => {
    const { prompt } = req.body;

    console.log("Received prompt:", prompt); // Debugging log

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const output = await convertText_prompt(prompt); // Use convertText_prompt here
        console.log("Scraped Output:", output); // Debugging log
        res.json({ output }); // Send the results back to the frontend
    } catch (error) {
        console.error("Error processing prompt:", error.message);
        res.status(500).json({ error: "Failed to process the prompt" });
    }
});
// app.get("/scrape", async (req, res) => {
//     const { url, limit } = req.query;

//     console.log("URL received:", url);
//     console.log("Limit received:", limit);

//     if (!url) return res.status(400).send("URL is required");

//     try {
//         const data = await scrapeWebsite(url, limit); // pass limit to scraper if needed
//         console.log("scraped data: ",data);
//         res.render("URLscraping/scrapedData", { data, url });
//     } catch (error) {
//         console.error("Scraping failed:", error);
//         res.status(500).send("Scraping failed.");
//     }
// });

app.listen(port, () => {
    console.log("Server is listening on port", port);
});




// Needed for POST body parsing

app.post('/process', async (req, res) => {
    const { prompt, inputText } = req.body;

    console.log("Received prompt:", prompt); // Debugging log
    console.log("Received inputText:", inputText); // Debugging log

    if (!prompt || !inputText) {
        return res.status(400).json({ error: "Missing instruction or inputText" });
    }

    try {
        const output = await convertText(prompt, inputText);
        console.log("AI output: ",output);
        res.json({ output });
    } catch (error) {
        console.error("Groq error:", error);
        res.status(500).json({ error: "Groq API failed" });
    }
});