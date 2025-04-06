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

button.addEventListener("click", function() {
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

    const retrievedData = {
        title: "Sample Title",
        description: "This is an example description of the scraped webpage.",
        sliderValue: sliderValue,
    };

    const dataDisplay = document.getElementById("dataDisplay");
    dataDisplay.innerHTML = `
        <label for="dataTitle">Title:</label>
        <input type="text" id="dataTitle" value="${retrievedData.title}" readonly>
        <label for="dataDescription">Description:</label>
        <div class="description-container">
            <textarea id="dataDescription" readonly>${retrievedData.description}</textarea>
            <button id="downloadButton" class="download-btn"><img src="/Data-weaver-HackHazard/public/download.svg"></img></button>
        </div>
    `;
    dataDisplay.style.display = "block";
});