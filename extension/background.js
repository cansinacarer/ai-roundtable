function askGemini(query) {
	// Filling out the form and submit action
	function submitGemini(query) {
		setTimeout(() => {
			document.querySelector("rich-textarea p").textContent = `${query}`;
			setTimeout(() => {
				document.querySelector(".send-button").click();
			}, 212);
		}, 1032);
	}

	// Open a new tab with Gemini
	chrome.tabs.create({ url: "https://gemini.google.com/app" }, (newTab) => {
		let executed = false;
		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			if (
				tabId === newTab.id &&
				changeInfo.status === "complete" &&
				!executed
			) {
				executed = true;

				chrome.scripting.executeScript({
					target: { tabId: tabId },
					func: submitGemini,
					args: [query],
				});
			}
		});
	});
}

function askClaude(query) {
	// Filling out the form and submit action
	function submitClaude(query) {
		setTimeout(() => {
			document.querySelector('[tabindex="0"] p').textContent = `${query}`;
			setTimeout(() => {
				document
					.querySelector('button[aria-label="Send Message"]')
					.click();
			}, 212);
		}, 432);
	}

	// Open a new tab with Claude
	chrome.tabs.create({ url: "https://claude.ai/new" }, (newTab) => {
		let executed = false;
		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			if (
				tabId === newTab.id &&
				changeInfo.status === "complete" &&
				!executed
			) {
				executed = true;

				chrome.scripting.executeScript({
					target: { tabId: tabId },
					func: submitClaude,
					args: [query],
				});
			}
		});
	});
}

function askBingAI(query) {
	// Open a new tab with Gemini
	chrome.tabs.create({
		url: `https://www.bing.com/chat?q=${query}&sendquery=1&FORM=SCCODX`,
	});
}

function askPerplexity(query) {
	// Open a new tab with Gemini
	chrome.tabs.create({
		url: `https://www.perplexity.ai/search/new?q=${query}`,
	});
}

// Listen for the for submit message from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "openNewTab") {
		if (request.target.includes("gemini")) {
			askGemini(request.query);
		}
		if (request.target.includes("claude")) {
			askClaude(request.query);
		}
		if (request.target.includes("bingai")) {
			askBingAI(request.query);
		}
		if (request.target.includes("perplexity")) {
			askPerplexity(request.query);
		}
	}
	sendResponse({ success: true });
});

// Listen for the keyboard shortcut for opening the popup
chrome.commands.onCommand.addListener((command) => {
	if (command === "_execute_action") {
		chrome.action.openPopup();
	}
});
