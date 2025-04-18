const express = require("express");
const app = express();
const port = 8080;
const path = require('path');
const scrapeWebsite = require('./scrapeWords-puppeteer'); // Import the scraping function
const convertText = require('./textprocessai');
const bodyParser = require('body-parser');
const convertText_prompt = require('./scrapingwithprompt_script');
const convertText_textdataset = require('./textualdatabse_build');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // or customize filename/destination
const AdmZip = require('adm-zip');
const fs = require('fs');
const { translateAudio } = require('./audioprocess');



app.use(express.json()); 
app.use(bodyParser.json()); 

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use('/image_dataset', express.static(path.join(__dirname, 'downloaded_images')));

app.use(express.static("src")); 
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

// Routes
app.get("/", (req, res) => {
    res.render("index"); 
});

app.get('/audiopress', (req, res) => {
    res.render('./audioScraper/audiopress'); // OR 'audio/audioscraper' if it's inside views/audio/
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
app.get("/view-image-dataset", (req, res) => {
    const fs = require("fs");
    const imagesDir = path.join(__dirname, "downloaded_images");
    const images = fs.readdirSync(imagesDir).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    res.render("Dataset/imagePreview", { images });
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

app.post('/generate-text-dataset', async (req, res) => {
    const { prompt, docx } = req.body;
    

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        await convertText_textdataset(`${prompt}\n\n${docx}`);  // This runs textualdatabse_build.js logic
        console.log("Dataset generated successfully.");
        res.json({ success: true });
    } catch (error) {
        console.error("Dataset generation failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.use('/output_dataset', express.static(path.join(__dirname, 'output_dataset')));


app.post('/generate-image-dataset', upload.single('image'), async (req, res) => {
    const imageFile = req.file;
    const { prompt, accuracy, datasetSize, greyscale, strength } = req.body;

    if (!imageFile) {
        return res.status(400).json({ success: false, error: "Image file is required." });
    }

    const path = require("path");
    const fs = require("fs");
    const { exec } = require("child_process");

    const imagePath = path.join(__dirname, 'uploads', 'sampleimage.jpg');

    // Rename/move the uploaded file to 'sampleimage.jpg'
    fs.renameSync(imageFile.path, imagePath);

    const { convertImage_prompt } = require('./imagedataset_builder');
    try {
        await convertImage_prompt(prompt, imagePath, accuracy, datasetSize, greyscale, strength);
        console.log("✅ Query generated and saved to tempsampleimageQuery.txt");

        // Call Python script to scrape images using the generated query
        exec("python3 google_imagescrape.py", (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Python Error: ${error.message}`);
                return res.status(500).json({ success: false, error: error.message });
            }
            if (stderr) {
                console.warn(`⚠️ Python Warning: ${stderr}`);
            }

            console.log(`✅ Python Output:\n${stdout}`);
            return res.json({ success: true, message: "Image scraping done!" });
        });
    } catch (err) {
        console.error("❌ Error running image dataset builder:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/download-image-dataset', (req, res) => {
    const zip = new AdmZip();
    const folderPath = path.join(__dirname, 'downloaded_images');

    if (!fs.existsSync(folderPath)) {
        return res.status(404).send("No images found to zip.");
    }

    zip.addLocalFolder(folderPath);
    const zipPath = path.join(__dirname, 'public', 'image_dataset.zip');
    zip.writeZip(zipPath);

    res.download(zipPath, 'image_dataset.zip', (err) => {
        if (err) {
            console.error("Error sending zip:", err);
            res.status(500).send("Could not download ZIP file.");
        } else {
            fs.unlink(zipPath, () => {}); // Clean up after download
        }
    });
});

app.get('/check-image-dataset', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const imagesDir = path.join(__dirname, 'downloaded_images');

    if (!fs.existsSync(imagesDir)) {
        return res.json({ available: false });
    }

    const files = fs.readdirSync(imagesDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
    res.json({ available: files.length > 0 });
});



app.post('/transcribe-audio', upload.single('audio'), async (req, res) => {
    const audioFile = req.file;
  
    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file uploaded.' });
    }
  
    try {
      const transcription = await translateAudio(audioFile.path);
      fs.unlinkSync(audioFile.path); // Clean up the uploaded file
      res.json({ transcription });
    } catch (error) {
      console.error('Error transcribing audio:', error.message);
      res.status(500).json({ error: 'Failed to transcribe audio.' });
    }
  });