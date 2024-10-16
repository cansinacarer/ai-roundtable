// Retrieve the checkbox states from the local storage using the Chrome API
function applySavedCheckboxStates(checkboxes) {
	chrome.storage.local.get(["checkboxStates"], (result) => {
		// If there are checkbox states saved in the local storage
		if (result.checkboxStates) {
			// Loop through all the checkboxes
			checkboxes.forEach((checkbox) => {
				// Set the checked state of each checkbox based on the saved checkbox states
				checkbox.checked = result.checkboxStates[checkbox.id];
			});
		}
	});
}

// Save the checkbox states in the local storage using the Chrome API
function saveCheckboxStates(checkboxes) {
	// Create an object to store the state of each checkbox
	const checkboxStates = {};

	// Loop through all the checkboxes
	checkboxes.forEach((cb) => {
		// Store the state of each checkbox in the object
		checkboxStates[cb.id] = cb.checked;
	});

	// Save the checkbox states in the local storage using the Chrome API
	chrome.storage.local.set({ checkboxStates });
}

// Create a list of selected targets
function getCheckedCheckboxNames() {
	// Select all checkboxes
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');

	// Filter for checked checkboxes and extract their names
	const checkedNames = Array.from(checkboxes)
		.filter((checkbox) => checkbox.checked)
		.map((checkbox) => checkbox.name);

	return checkedNames;
}

// When the input submit button is clicked, send a message to the background script
function listenForFormSubmit(form) {
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		processForm(form);
	});
}

// Process the form
function processForm() {
	// Check if at least one AI assistant is selected
	selectedAIAssistants = getCheckedCheckboxNames();
	if (selectedAIAssistants.length === 0) {
		alert("Please select at least one AI assistant");
		return;
	}

	const query = document.getElementById("query").value;

	// Send message to the background script to do the rest
	// We cannot do it here because execution of this script stops if we open a new tab
	chrome.runtime.sendMessage({
		action: "submitToAssistants",
		query: query,
		target: selectedAIAssistants,
	});
}

// Add an event listener to each checkbox
function listenForCheckboxChange(checkboxes) {
	checkboxes.forEach((checkbox) => {
		checkbox.addEventListener("change", () => {
			// Save the checkbox states in the local storage using the Chrome API
			saveCheckboxStates(checkboxes);
		});
	});
}

// Toggle checkbox with id "claude" when keyboard button 1 is clicked
function listenForKeyboardShortcuts(checkboxes, form) {
	document.addEventListener("keydown", (event) => {
		// If the alt key is pressed, this is a checkbox state change shortcut
		if (event.altKey) {
			if (event.key === "1") {
				const checkbox = document.getElementById("gemini");
				checkbox.checked = !checkbox.checked;
			}
			if (event.key === "2") {
				const checkbox = document.getElementById("claude");
				checkbox.checked = !checkbox.checked;
			}
			if (event.key === "3") {
				const checkbox = document.getElementById("bingai");
				checkbox.checked = !checkbox.checked;
			}
			if (event.key === "4") {
				const checkbox = document.getElementById("perplexity");
				checkbox.checked = !checkbox.checked;
			}
			if (event.key === "5") {
				const checkbox = document.getElementById("chatgpt");
				checkbox.checked = !checkbox.checked;
			}
			saveCheckboxStates(checkboxes);
		}

		// If Ctrl + Enter, submit the form
		if (event.ctrlKey && event.key === "Enter") {
			processForm();
		}
	});
}

// When the popup is opened, locate the checkboxes and add event listeners
document.addEventListener("DOMContentLoaded", function () {
	// Checkboxes for AI assistants
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');

	// Query form
	const form = document.getElementById("queryForm");

	// Update the checkbox states when the popup is opened
	applySavedCheckboxStates(checkboxes);

	// Add an event listener to each checkbox
	listenForCheckboxChange(checkboxes);

	// Listen for keyboard shortcuts
	listenForKeyboardShortcuts(checkboxes, form);

	// Listen for form submit
	listenForFormSubmit(form);
});
