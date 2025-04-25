const slider = document.getElementById("volumeSlider");
const output = document.getElementById("volumeValue");
const roleButtons = document.querySelectorAll('.role-btn');
const container = document.querySelector('.role-buttons'); // Parent container for role buttons
const scrapeButton = document.querySelector('.scrapebtn'); // Scrape now button
const textArea = document.getElementById('url'); // Textarea element
const outputPanel = document.getElementById('outputPanel');
const outputContent = document.getElementById('outputContent');
const additionalPrompt = document.getElementById('additionalPrompt'); // Additional prompt input
const sendAdditionalPrompt = document.getElementById('sendAdditionalPrompt'); // Send button for additional prompt
const originalContainer = document.getElementById('originalContainer'); // Original container
const questionPanel = document.querySelector('.question-panel');
// Add an event listener for the JSON button
// Add an event listener for the JSON button
const jsonButton = document.getElementById('jsonButton');
function processAIOutput(text) {
    // Extract specific fields using patterns or AI-generated structure
    const nameMatch = text.match(/Who is (.*?)\?/i);
    const dateOfBirthMatch = text.match(/born (.*?) on (.*?),/i);
    const addressMatch = text.match(/Born in (.*?),/i);
    const summaryMatch = text.match(/TL;DR (.*)/i);

    // Extract sections dynamically
    const earlyLifeMatch = text.match(/Early Life and Career([\s\S]*?)Achievements/i);
    const achievementsMatch = text.match(/Achievements([\s\S]*?)Style and Records/i);
    const styleAndRecordsMatch = text.match(/Style and Records([\s\S]*?)Leadership and Captaincy/i);
    const leadershipMatch = text.match(/Leadership and Captaincy([\s\S]*?)Personal Life/i);
    const personalLifeMatch = text.match(/Personal Life([\s\S]*?)Legacy/i);
    const legacyMatch = text.match(/Legacy([\s\S]*)/i);

    // Create a structured JSON object
    const structuredData = {
        name: nameMatch ? nameMatch[1].trim() : "N/A",
        dateOfBirth: dateOfBirthMatch ? dateOfBirthMatch[2].trim() : "N/A",
        address: addressMatch ? addressMatch[1].trim() : "N/A",
        summary: summaryMatch ? summaryMatch[1].trim() : "N/A",
        sections: {
            earlyLife: earlyLifeMatch ? earlyLifeMatch[1].trim() : "N/A",
            achievements: achievementsMatch ? achievementsMatch[1].trim() : "N/A",
            styleAndRecords: styleAndRecordsMatch ? styleAndRecordsMatch[1].trim() : "N/A",
            leadership: leadershipMatch ? leadershipMatch[1].trim() : "N/A",
            personalLife: personalLifeMatch ? personalLifeMatch[1].trim() : "N/A",
            legacy: legacyMatch ? legacyMatch[1].trim() : "N/A"
        },
        fullOutput: text // Include the full text as a fallback
    };

    return structuredData;
}


// Update the JSON button logic to use the processed output
jsonButton.addEventListener('click', () => {
    const outputContent = document.getElementById('outputContent').innerText.trim();

    if (!outputContent) {
        alert('No output data available to generate JSON.');
        return;
    }

    // Process the output into structured fields
    const structuredOutput = processAIOutput(outputContent);

    // Convert structured data to a JSON string
    const jsonString = JSON.stringify(structuredOutput, null, 2);

    // Create a Blob object
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'structured_output.json';

    // Trigger the download
    link.click();
});


roleButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove the 'active' class from all buttons
        roleButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add the 'active' class to the clicked button
        button.classList.add('active');
        
        // Check if the "Other" button is clicked
        if (button.getAttribute('data-role') === 'other') {
            // Remove any existing input field
            const existingInput = document.getElementById('otherRoleInput');
            if (existingInput) existingInput.remove();

            // Create a new input field
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.id = 'otherRoleInput';
            inputField.placeholder = 'Enter your role';
            inputField.style.marginTop = '10px'; // Add some spacing
            inputField.style.padding = '8px'; // Add padding for better appearance
            inputField.style.border = '1px solid #ccc';
            inputField.style.borderRadius = '8px';
            inputField.style.width = '100%';

            // Append the input field after the role buttons
            container.appendChild(inputField);
        } else {
            // Remove the input field if it exists and "Other" is not selected
            const existingInput = document.getElementById('otherRoleInput');
            if (existingInput) existingInput.remove();
        }

        // Update the global selectedRole variable
        selectedRole = button.getAttribute('data-role');
        console.log('Selected Role:', selectedRole); // Log the selected role
    });
});

scrapeButton.addEventListener('click', async () => {
    // Check if a role is selected
    if (!selectedRole) {
        alert('Please select any one role before proceeding.');
        return;
    }

    // If "Other" is selected, check if the input field has a value
    if (selectedRole === 'other') {
        const otherRoleInput = document.getElementById('otherRoleInput');
        if (!otherRoleInput || otherRoleInput.value.trim() === '') {
            alert('Please enter your role in the input field.');
            return;
        }
        selectedRole = otherRoleInput.value.trim();
    }

    // Check if the textarea is empty
    const textAreaValue = textArea.value.trim();
    if (!textAreaValue) {
        alert('Please enter a text in the textarea.');
        return;
    }

    // Construct the final prompt
    const finalPrompt = `${textAreaValue} I am a ${selectedRole}. Keep the strength and detail of my information to ${slider.value}.`;

    // Show loading animation and add blur effect to main content
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('mainContent').classList.add('blurred'); // Add blur effect to main content

    console.log("Final Prompt:", finalPrompt);

    // Send the prompt to the backend
    try {
        const response = await fetch('/scrapePrompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: finalPrompt })
        });

        if (!response.ok) throw new Error("Failed to fetch results");

        const result = await response.json();
        console.log("Scraped Results:", result);

        // Display the results in the output panel
        const outputPanel = document.querySelector('.output-panel');
        const outputContent = document.getElementById('outputContent');
        outputContent.innerHTML = `<pre>${formatBoldText(result.output)}</pre>`;
        outputPanel.style.display = 'block';
        questionPanel.style.display = 'block';
        originalContainer.style.display = 'none';
    } catch (err) {
        console.error("Error fetching results:", err.message);
        alert("Failed to fetch results. Please try again.");
    } finally {
        // Hide loading animation and remove blur effect
        document.getElementById('loadingIndicator').style.display = 'none';
        document.getElementById('mainContent').classList.remove('blurred'); // Remove blur effect
    }
});

// Send button functionality for additional prompt
sendAdditionalPrompt.addEventListener('click', async () => {
    const followUpPrompt = additionalPrompt.value.trim();
    if (!followUpPrompt) {
        alert('Please enter a question.');
        return;
    }

    console.log("Prompt:", followUpPrompt);

    try {
        const response = await fetch('/scrapePrompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: followUpPrompt })
        });

        if (!response.ok) throw new Error("Failed to fetch follow-up results");

        const result = await response.json();
        console.log("Follow-up Results:", result);

        // Fade out the previous content
        outputContent.style.transition = "opacity 0.5s ease";
        outputContent.style.opacity = "0";

        // After fade, clear and reset with follow-up content
        setTimeout(() => {
            outputContent.innerHTML = '';
            outputContent.style.opacity = "1";

            outputContent.innerHTML += `<h4> Question:</h4><p>${followUpPrompt}</p>`;
            outputContent.innerHTML += `<h4> Response:</h4><pre>${result.output}</pre>`;
        }, 500);
    } catch (err) {
        console.error("Error fetching follow-up results:", err.message);
        alert("Failed to fetch follow-up results. Please try again.");
    }
});

// Initialize the slider value display
slider.addEventListener("input", function() {
    output.textContent = slider.value;
    
    // Calculate the fill percentage
    let value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

    // Apply dynamic background
    slider.style.background = `linear-gradient(to right,rgb(0, 0, 0) 0%,rgb(71, 73, 71) ${value}%, #d9d9d9 ${value}%)`;
});














function formatBoldText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<br><strong>$1</strong>') // Make bold text appear on a new line
        .replace(/\*(?!\*)(.*?)\n?/g, '<br>• $1'); // Convert single * to bullet point with line break
}



document.getElementById("outputContent").innerHTML = formatBoldText(yourGeneratedText);
