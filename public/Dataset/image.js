// image upload
document.getElementById("imageUpload").addEventListener("change", function () {
    const files = this.files;
    const previewContainer = document.getElementById("imagePreviewContainer");
    previewContainer.innerHTML = ""; // Clear old previews

    if (files.length > 0) {
        document.getElementById("imagePreview").style.display = "block";

        [...files].forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.className = "image-thumb";
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }
});

// Cooking Button Logic
document.querySelector(".start-btn").addEventListener("click", function () {
    const prompt = document.getElementById("datasetPrompt").value;
    const accuracy = document.getElementById("accuracy").value;
    const datasetSize = document.getElementById("datasetSize").value;
    const strength = document.getElementById("strength").value;
    

    console.log("Prompt:", prompt);
    console.log("Images uploaded:", document.getElementById("imageUpload").files.length);
    console.log("Accuracy:", accuracy);
    console.log("Dataset Size:", datasetSize);
    console.log("Strength:", strength);
    

    alert("Image dataset processing started! (check console for now)");
});