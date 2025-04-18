from icrawler.builtin import GoogleImageCrawler
import shutil
shutil.rmtree('downloaded_images',ignore_errors=True)

# Path to your query file
query_file = "tempsampleimageQuery.txt"

# Read the first line and extract the query before the "|"
with open(query_file, "r") as f:
    line = f.readline()
    query = line.split('|')[0].strip()  # Extract text before first '|'

print(f"Scraping images for query: {query}")

# Setup image crawler
google_crawler = GoogleImageCrawler(storage={'root_dir': 'downloaded_images'})
google_crawler.crawl(keyword=query, max_num=10)

print("✅ Image scraping complete. Images saved in 'downloaded_images/'")