const slider = document.getElementById("volumeSlider");
const output = document.getElementById("volumeValue");
const roleButtons = document.querySelectorAll('.role-btn');
const container = document.querySelector('.role-buttons'); // Parent container for role buttons
const scrapeButton = document.querySelector('.btn'); // Scrape now button
const textArea = document.getElementById('url'); // Textarea element


let selectedRole = null; // Variable to store the selected role

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

scrapeButton.addEventListener('click', () => {
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
        console.log('Custom Role:', otherRoleInput.value.trim());
    }
    // Check if the textarea is empty
    const textAreaValue = textArea.value.trim();
    if (!textArea.value.trim()) {
        alert('Please enter a text in the textarea.');
        return;
    }
    
    
    console.log('Textarea Value:', textAreaValue);

    
    console.log('Slider Value:', slider.value);
    // Proceed with scraping logic
    console.log('Scraping initiated for role:', selectedRole);
});

// Initialize the slider value display
slider.addEventListener("input", function() {
    output.textContent = slider.value;
    
    // Calculate the fill percentage
    let value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

    // Apply dynamic background
    slider.style.background = `linear-gradient(to right,rgb(0, 0, 0) 0%,rgb(71, 73, 71) ${value}%, #d9d9d9 ${value}%)`;
});