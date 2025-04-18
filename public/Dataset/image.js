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
    const greyscaleInput = document.getElementById("greyscale");
    const greyscale = greyscaleInput ? greyscaleInput.value : "false";
    console.log("Prompt:", prompt);
    console.log("Images uploaded:", document.getElementById("imageUpload").files.length);
    console.log("Accuracy:", accuracy);
    console.log("Dataset Size:", datasetSize);
    console.log("Strength:", strength);
    console.log("Greyscale:", greyscale);

    const imageFile = document.getElementById("imageUpload").files[0];

    if (!imageFile) {
        alert("Please upload an image.");
        return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("prompt", prompt);
    formData.append("accuracy", accuracy);
    formData.append("datasetSize", datasetSize);
    formData.append("strength", strength);
    formData.append("greyscale", greyscale);

    fetch('/generate-image-dataset', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ Image query generated and saved successfully.");
            document.getElementById("viewDatasetBtn").style.display = "inline-block";
        } else {
            alert("❌ Failed to generate image query.");
        }
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("❌ Error triggering backend.");
    });
});

window.addEventListener("DOMContentLoaded", () => {
    fetch('/check-image-dataset')
        .then(res => res.json())
        .then(data => {
            if (data.available) {
                document.getElementById("viewDatasetBtn").style.display = "inline-block";
            }
        });
});