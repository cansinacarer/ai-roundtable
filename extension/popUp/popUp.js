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
		processForm();
	});
}

// Save the query in the textarea
function saveQuery(query) {
	chrome.storage.local.set({ savedText: query });
}

// Clear saved query from storage
function clearQuery() {
	chrome.storage.local.remove("savedText");
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

	// Clear the saved query
	clearQuery();
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

// Add an event listener to the textarea
function listenForTextareaChange(textarea) {
	textarea.addEventListener("input", function () {
		saveQuery(textarea.value);
	});
}

// Load the saved query from the local storage
function loadSavedQuery(textarea) {
	chrome.storage.local.get(["savedText"], (result) => {
		if (result.savedText) {
			textarea.value = result.savedText;
		}
	});
}

// Toggle checkbox with id "claude" when keyboard button 1 is clicked
function listenForKeyboardShortcuts(checkboxes, form) {
	document.addEventListener("keydown", (event) => {
		// If the alt key is pressed, this is a checkbox state change shortcut
		if (event.altKey) {
			switch (event.key) {
				case "1":
					toggleCheckbox("gemini");
					break;
				case "2":
					toggleCheckbox("claude");
					break;
				case "3":
					toggleCheckbox("bingai");
					break;
				case "4":
					toggleCheckbox("perplexity");
					break;
				case "5":
					toggleCheckbox("chatgpt");
					break;
				case "6":
					toggleCheckbox("metaai");
					break;
				default:
					break;
			}
			saveCheckboxStates(checkboxes);
		}

		// If Ctrl + Enter, submit the form
		if (event.ctrlKey && event.key === "Enter") {
			processForm();
		}
	});
}

// Helper function to toggle checkbox by ID
function toggleCheckbox(id) {
	const checkbox = document.getElementById(id);
	if (checkbox) {
		checkbox.checked = !checkbox.checked;
	}
}

// When the popup is opened, locate the checkboxes and add event listeners
document.addEventListener("DOMContentLoaded", function () {
	// Checkboxes for AI assistants
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');

	// Query form
	const form = document.getElementById("queryForm");

	// Textarea for query input
	const textarea = document.getElementById("query");

	// Load the saved query from the local storage
	loadSavedQuery(textarea);

	// Update the checkbox states when the popup is opened
	applySavedCheckboxStates(checkboxes);

	// Add an event listener to each checkbox
	listenForCheckboxChange(checkboxes);

	// Add an event listener to the textarea
	listenForTextareaChange(textarea);

	// Listen for keyboard shortcuts
	listenForKeyboardShortcuts(checkboxes, form);

	// Listen for form submit
	listenForFormSubmit(form);
});
document.addEventListener('DOMContentLoaded', () => {
	const textarea = document.getElementById('query');

	const autoResize = () => {
		// Store the current scroll position
		const scrollPos = window.scrollY;

		// Reset the height to calculate the scrollHeight correctly
		textarea.style.height = 'auto';

		// Set the height to match the scrollHeight
		textarea.style.height = `${textarea.scrollHeight}px`;

		// Restore the scroll position
		window.scrollTo(0, scrollPos);

		// If using a browser extension and want to resize the popup window
		if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
			// Estimate the new height based on textarea content
			const newHeight = Math.min(
				Math.max(textarea.scrollHeight + 150, 300), // minimum 300px
				800 // maximum 800px for the entire popup
			);
			chrome.runtime.sendMessage({ type: 'resize', height: newHeight });
		}
	};

	// Initialize the height on page load
	autoResize();

	// Add event listener for input events
	textarea.addEventListener('input', () => {
		requestAnimationFrame(autoResize);
	});

	// Handle form submission with Ctrl + Enter
	const form = document.getElementById('queryForm');
	form.addEventListener('keydown', (e) => {
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
			e.preventDefault();
			form.submit();
		}
	});
});
