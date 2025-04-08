const puppeteer = require('puppeteer');

async function scrapeWebsite(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const text = await page.evaluate(() => document.body.innerText);
  const words = text.match(/\b\w+\b/g) || [];
  const firstThousand = words.slice(0, 1000).join(' ');

  await browser.close();
  return firstThousand;
}

module.exports = scrapeWebsite;

(async () => {
  const url = 'https://example.com'; // Replace with the URL you want to scrape
  const result = await scrapeWebsite(url);
  console.log(result);
})();
