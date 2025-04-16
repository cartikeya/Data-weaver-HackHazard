// Handle audio upload via label click
const audioLabel = document.querySelector('label[for="audioUpload"]');
const audioInput = document.getElementById('audioUpload');
const audioPreviewBox = document.getElementById('docxPreview');
const audioContentBox = document.getElementById('docxContent');

    
    


document.getElementById('audioUpload').addEventListener('change', function () {
    const file = this.files[0];
    const previewBox = document.getElementById("audioPreview");
    const contentBox = document.getElementById("audioContent");

    if (file && file.type.startsWith("audio")) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = URL.createObjectURL(file);
        contentBox.innerHTML = '';
        contentBox.appendChild(audio);
        previewBox.style.display = "block";
    }
});

// Handle Start Cooking button
document.querySelector(".start-btn").addEventListener("click", function () {
    const prompt = document.getElementById("datasetPrompt").value;
    const accuracy = document.getElementById("accuracy").value;
    const datasetSize = document.getElementById("datasetSize").value;
    const audiosharpness = document.getElementById("audiosharpness").value;
    const diversity = document.getElementById("diversity").value;
    const uploadedAudio = audioInput.files[0];

    console.log("Prompt:", prompt);
    console.log("Uploaded Audio:", uploadedAudio ? uploadedAudio.name : "None");
    console.log("Accuracy:", accuracy);
    console.log("Dataset Size:", datasetSize);
    console.log("Audio Sharpness:", audiosharpness);
    console.log("Diversity:", diversity);

    alert("Audio dataset cooking started! (check console)");
});