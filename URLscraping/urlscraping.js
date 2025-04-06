const slider = document.getElementById("volumeSlider");
const output = document.getElementById("volumeValue");

slider.addEventListener("input", function() {
    output.textContent = slider.value;
    
    // Calculate the fill percentage
    let value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

    // Apply dynamic background
    slider.style.background = `linear-gradient(to right,rgb(0, 0, 0) 0%,rgb(71, 73, 71) ${value}%, #d9d9d9 ${value}%)`;
});