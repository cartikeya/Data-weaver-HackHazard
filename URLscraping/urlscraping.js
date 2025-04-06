const slider = document.getElementById("volumeSlider");
const output = document.getElementById("volumeValue");
const button = document.querySelector(".btn");
const urlInput = document.getElementById("url");

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
});