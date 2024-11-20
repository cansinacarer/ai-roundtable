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

	// Open a new tab with Claude AI
	chrome.tabs.create({
		url: `https://claude.ai/new?q=${encodedQuery}`,
	});
}

function askBingAI(query) {
	// URLEncode the query
	const encodedQuery = encodeURIComponent(query);

	// Open a new tab with Bing AI
	chrome.tabs.create({
		url: `https://www.bing.com/chat?q=${encodedQuery}&sendquery=1&FORM=SCCODX`,
	});
}

function askPerplexity(query) {
	// URLEncode the query
	const encodedQuery = encodeURIComponent(query);

	// Open a new tab with Perplexity AI
	chrome.tabs.create({
		url: `https://www.perplexity.ai/search/new?q=${encodedQuery}`,
	});
}

function askChatGPT(query) {
	// URLEncode the query
	const encodedQuery = encodeURIComponent(query);

	// Open a new tab with ChatGPT
	chrome.tabs.create({
		url: `https://www.chatgpt.com/?q=${encodedQuery}`,
	});
}

// **New Function: Handle Meta AI**
function askMetaAI(query) {
	chrome.tabs.create({ url: "https://www.meta.ai/" }, (newTab) => {
		const onUpdated = (tabId, changeInfo) => {
			if (tabId === newTab.id && changeInfo.status === "complete") {
				chrome.tabs.onUpdated.removeListener(onUpdated);
				const submitMetaAI = async (q) => {
					const waitFor = (sel, to = 5000) => new Promise((res, rej) => {
						const interval = setInterval(() => {
							const el = document.querySelector(sel);
							if (el) { clearInterval(interval); res(el); }
						}, 100);
						setTimeout(() => { clearInterval(interval); rej(`Missing: ${sel}`); }, to);
					});
					try {
						const [input, button] = await Promise.all([
							waitFor('textarea[placeholder="Ask Meta AI anything..."]'),
							waitFor('div[aria-label="Send Message"][role="button"]')
						]);
						input.focus();
						input.value = q;
						input.dispatchEvent(new Event('input', { bubbles: true }));
						button.click();
						console.log("Meta AI: Query submitted.");
					} catch (err) {
						console.error(`Meta AI Error: ${err}`);
					}
				};
				chrome.scripting.executeScript({
					target: { tabId: newTab.id },
					func: submitMetaAI,
					args: [query],
				}).then(() => console.log("Meta AI: Script injected."))
					.catch(err => console.error(`Injection Failed: ${err}`));
			}
		};
		chrome.tabs.onUpdated.addListener(onUpdated);
	});
}



// Listen for the submit message from the popup

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
		if (request.target.includes("metaai")) {
			askMetaAI(request.query);
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
