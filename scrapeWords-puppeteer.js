const puppeteer = require('puppeteer');

async function scrapeWebsite(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const html = await page.content(); // Get the entire HTML content of the page

  await browser.close();
  return html;
  console.log("chakke")
}
module.exports = scrapeWebsite;

(async () => {
  const url = 'https://example.com'; // Replace with the URL you want to scrape
  const result = await scrapeWebsite(url);
  console.log(result);
})();
