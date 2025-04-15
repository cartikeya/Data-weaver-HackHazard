const puppeteer = require('puppeteer');
// const { openAI } = require('openai');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: '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', // 🔐 Replace with your Groq API key
  baseURL: 'https://api.groq.com/openai/v1'
});

async function scrapeWebsite(url) {
  if (!url) {
    throw new Error("URL is required");
  }

  const browser = await puppeteer.launch({ headless: true }); // Set to false if you want to see it open Chrome
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36');

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    const pageText = await page.evaluate(() => {
      return document.body.innerText;
    });

    const words = pageText.match(/\b\w+\b/g) || [];
    const firstThousand = words.slice(0, 3000).join(' ');

    const summarizedText = await summarizeText(firstThousand)
    // console.log('summarized text: ',summarizedText);
    await browser.close();
    return summarizedText;

  } catch (err) {
    await browser.close();
    throw new Error(`Error scraping website: ${err.message}`);
  }
}

//function to summarise text using api
async function summarizeText(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "llama3-8b-8192", // or "llama3-70b-8192"
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes articles into simple points."
        },
        {
          role: "user",
          content: `Extract and present all the content from the website accurately and completely. Include both important and regular details, without skipping or summarizing anything. Remove unnecessary or irrelevant data, and retain all original text and formatting as it appears on the site. \n\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    throw new Error(`Error summarizing text: ${err.message}`);
  }
}

if (require.main === module) {
  const url = process.argv[2];

  scrapeWebsite(url)
    .then(data => {
      console.log("Summarized text :\n", data);
    })
    .catch(err => {
      console.error("Error:", err.message);
    });
}
module.exports = scrapeWebsite;

