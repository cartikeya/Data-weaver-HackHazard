// Load and preview .docx file using mammoth.js
document.getElementById('docxUpload').addEventListener('change', async function () {
    const file = this.files[0];
    if (file && file.name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = async function (event) {
            const arrayBuffer = event.target.result;
            const result = await window.mammoth.convertToHtml({ arrayBuffer });
            document.getElementById("docxContent").innerHTML = result.value;
            document.getElementById("docxPreview").style.display = "block";
        };
        reader.readAsArrayBuffer(file);
    }
});

//cooking button
document.querySelector(".start-btn").addEventListener("click", function () {
    const prompt = document.getElementById("datasetPrompt").value;
    const vocabRichness = document.getElementById("vocabRichness").value;
    const datasetSize = document.getElementById("datasetSize").value;
    const strength = document.getElementById("strength").value;
    const entryLength = document.getElementById("entryLength").value;
    const docxContent = document.getElementById("docxContent").innerText;

    // You can now send this data to your backend via fetch/POST
    console.log("Prompt:", prompt);
    console.log("Docx Content:", docxContent);
    console.log("Vocabulary Richness:", vocabRichness);
    console.log("Dataset Size:", datasetSize);
    console.log("Strength:", strength);
    console.log("Entry Length:", entryLength);

    alert("Dataset cooking started! (check console for now)");
});