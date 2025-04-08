const slider = document.getElementById("volumeSlider");
const output = document.getElementById("volumeValue");
const button = document.querySelector(".btn");
const urlInput = document.getElementById("url");
const dataContainer = document.createElement("div");
dataContainer.classList.add("data-container");
document.body.appendChild(dataContainer);

slider.addEventListener("input", function() {
    output.textContent = slider.value;
    
    // Calculate the fill percentage
    let value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

    // Apply dynamic background
    slider.style.background = `linear-gradient(to right,rgb(0, 0, 0) 0%,rgb(71, 73, 71) ${value}%, #d9d9d9 ${value}%)`;
});

button.addEventListener("click", async function () {
    const url = urlInput.value;
    const sliderValue = slider.value;

    // Validate URL
    const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/;
    if (!urlPattern.test(url)) {
        alert("Please enter a valid URL.");
        return;
    }

    console.log("URL:", url);
    console.log("Slider Value:", sliderValue);

    try {
        // Send a GET request to the /scrape endpoint with the URL as a query parameter
        const response = await fetch(`/scrape?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error("Failed to scrape the website");
        }

        const scrapedData = await response.text(); // Get the scraped data from the response
        console.log("Scraped Data:", scrapedData);

        // Dynamically create the dataDisplay element if it doesn't exist
        let dataDisplay = document.getElementById("dataDisplay");
        if (!dataDisplay) {
            dataDisplay = document.createElement("div");
            dataDisplay.id = "dataDisplay";
            document.body.appendChild(dataDisplay);
        }

        // Display the scraped data
        dataDisplay.innerHTML = `
            <label for="dataTitle">Scraped Data:</label>
            <textarea id="scrapedData" readonly>${scrapedData}</textarea>
        `;
        dataDisplay.style.display = "block";
    } catch (error) {
        console.error("Error scraping the website:", error);
        alert("Error scraping the website. Please check the console for details.");
    }
});