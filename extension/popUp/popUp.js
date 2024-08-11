// Save and retrieve checkbox states in the local storage using the Chrome API
document.addEventListener("DOMContentLoaded", function() {
    // Get all the checkboxes on the page
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Add an event listener to each checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Create an object to store the state of each checkbox
            const checkboxStates = {};
            
            // Loop through all the checkboxes
            checkboxes.forEach(cb => {
                // Store the state of each checkbox in the object
                checkboxStates[cb.id] = cb.checked;
            });
            
            // Save the checkbox states in the local storage using the Chrome API
            chrome.storage.local.set({ checkboxStates });
        });
    });

    // Retrieve the checkbox states from the local storage using the Chrome API
    chrome.storage.local.get(['checkboxStates'], (result) => {
        // If there are checkbox states saved in the local storage
        if (result.checkboxStates) {
            // Loop through all the checkboxes
            checkboxes.forEach(checkbox => {
                // Set the checked state of each checkbox based on the saved checkbox states
                checkbox.checked = result.checkboxStates[checkbox.id];
            });
        }
    });
});


// Create a list of selected targets
function getCheckedCheckboxNames() {
    // Select all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
    // Filter for checked checkboxes and extract their names
    const checkedNames = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.name);
  
    return checkedNames;
}

// When the input submit button is clicked, open a new tab with the query alert
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('queryForm');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = document.getElementById('query').value;

        // Send message to the background script to do the rest
        // We cannot do it here because execution of this script stops if we open a new tab
        chrome.runtime.sendMessage({
            action: 'openNewTab',
            query: query,
            target: getCheckedCheckboxNames()
        });
    });
});


// Toggle checkbox with id "claude" when keyboard button 1 is clicked
document.addEventListener('keydown', (event) => {
    if (event.altKey && event.key === '1') {
        const checkbox = document.getElementById('claude');
        checkbox.checked = !checkbox.checked;
    }
    if (event.altKey && event.key === '2') {
        const checkbox = document.getElementById('gemini');
        checkbox.checked = !checkbox.checked;
    }
    if (event.altKey && event.key === '3') {
        const checkbox = document.getElementById('bingai');
        checkbox.checked = !checkbox.checked;
    }
});