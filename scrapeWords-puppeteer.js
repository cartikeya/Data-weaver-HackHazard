const puppeteer = require('puppeteer');

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
    const firstThousand = words.slice(0, 3000);

    await browser.close();
    return firstThousand.join(' ');
  } catch (err) {
    await browser.close();
    throw new Error(`Error scraping website: ${err.message}`);
  }
}


module.exports = scrapeWebsite;

