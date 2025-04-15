const slider = document.getElementById("volumeSlider");
const output = document.getElementById("volumeValue");
const button = document.querySelector(".btn");
const urlInput = document.getElementById("url");
const dataContainer = document.createElement("div");
dataContainer.classList.add("data-container");
document.body.appendChild(dataContainer);


// slider.addEventListener("input", function() {
//     output.textContent = slider.value;
    
//     // Calculate the fill percentage
//     let value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

//     // Apply dynamic background
//     slider.style.background = `linear-gradient(to right,rgb(0, 0, 0) 0%,rgb(71, 73, 71) ${value}%, #d9d9d9 ${value}%)`;
// });

// button.addEventListener("click", async function () {
//     const url = urlInput.value;
//     const sliderValue = slider.value;

//     // Validate URL
//     const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/;
//     if (!urlPattern.test(url)) {
//         alert("Please enter a valid URL.");
//         return;
//     }

//     console.log("URL:", url);
//     console.log("Slider Value:", sliderValue);
    

//     try {
//         // Make the GET request to the real /scrape endpoint
//         const response = await fetch(`/scrape?url=${encodeURIComponent(url)}&limit=${sliderValue}`);
//         if (!response.ok) throw new Error("Scrape request failed");
    
//         const scrapedData = await response.text(); // Get response as text
//         console.log("Scraped Data:", scrapedData);
    
//         // Redirect to the new page with scraped data and URL
//         window.location.href = `/scrapedData?data=${encodeURIComponent(scrapedData)}&url=${encodeURIComponent(url)}`;
//     } catch (error) {
//         console.error("Error scraping the website:", error);
//         alert("Error scraping the website. Please check the console for details.");
//     }
    
// });

slider.addEventListener("input", () => {
    output.textContent = slider.value;
    let value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, black 0%, grey ${value}%, #d9d9d9 ${value}%)`;
});

button.addEventListener("click", () => {
    const url = urlInput.value.trim();
    const limit = slider.value;

    console.log("URL entered:", url);
    console.log("Limit selected:", limit);

    // const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/;
    // if (!urlPattern.test(url)) {
    //     alert("Please enter a valid URL.");
    //     return;
    // }

    // Redirect to backend which will scrape and render
    window.location.href = `/scrape?url=${encodeURIComponent(url)}&limit=${encodeURIComponent(limit)}`;
});