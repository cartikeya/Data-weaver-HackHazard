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

    const fullInput = `
        Prompt: ${prompt}

        Docx Content: ${docxContent}

        Vocabulary Richness: ${vocabRichness}
        Dataset Size: ${datasetSize}
        Strength: ${strength}
        Entry Length: ${entryLength}
    `;
    console.log("Combined Input:", fullInput);
    console.log("Docx content: ",docxContent);

    // Navigate to output page
    // const encodedInput = encodeURIComponent(fullInput);
    fetch('/generate-text-dataset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: fullInput })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.location.href = '/Dataset/output.html';
        } else {
          alert("Failed to generate dataset.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("An error occurred.");
      });
});