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
	// URLEncode the query
	const encodedQuery = encodeURIComponent(query);

	// Open a new tab with Gemini
	chrome.tabs.create({
		url: `https://claude.ai/new?q=${encodedQuery}`,
	});
}

function askBingAI(query) {
	// URLEncode the query
	const encodedQuery = encodeURIComponent(query);

	// Open a new tab with Gemini
	chrome.tabs.create({
		url: `https://www.bing.com/chat?q=${encodedQuery}&sendquery=1&FORM=SCCODX`,
	});
}

function askPerplexity(query) {
	// URLEncode the query
	const encodedQuery = encodeURIComponent(query);

	// Open a new tab with Gemini
	chrome.tabs.create({
		url: `https://www.perplexity.ai/search/new?q=${encodedQuery}`,
	});
}

function askChatGPT(query) {
	// URLEncode the query
	const encodedQuery = encodeURIComponent(query);

	// Open a new tab with Gemini
	chrome.tabs.create({
		url: `https://www.chatgpt.com/?q=${encodedQuery}`,
	});
}

// Listen for the for submit message from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "submitToAssistants") {
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
		if (request.target.includes("chatgpt")) {
			askChatGPT(request.query);
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
