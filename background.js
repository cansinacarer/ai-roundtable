

function askGemini(query) {
    // Filling out the form and submit action
    function submitGemini(query) {
        setTimeout(() => {
            document.querySelector('rich-textarea p').textContent = `${query}`;
            setTimeout(() => {
                document.querySelector('.send-button').click();
            }, 212);
        }, 1032);
    }

    // Open a new tab with Gemini
    chrome.tabs.create({url: 'https://gemini.google.com/app'}, (newTab) => {
        let executed = false;
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (tabId === newTab.id && changeInfo.status === 'complete' && !executed) {
                executed = true;

                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: submitGemini,
                    args: [query]
                });
            };
        });
    });
}


function askClaude(query) {
    // Filling out the form and submit action
    function submitClaude(query) {
        setTimeout(() => {
            document.querySelector('[tabindex="0"] p').textContent = `${query}`;
            setTimeout(() => {
                document.querySelector('button[aria-label="Send Message"]').click();
            }, 212);
        }, 432);
    }

    // Open a new tab with Claude
    chrome.tabs.create({url: 'https://claude.ai/new'}, (newTab) => {
        let executed = false;
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (tabId === newTab.id && changeInfo.status === 'complete' && !executed) {
                executed = true;

                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: submitClaude,
                    args: [query]
                });
            };
        });
    });
}

function askBingAI(query) {
    // Open a new tab with Gemini
    chrome.tabs.create({url: `https://www.bing.com/chat?q=${query}&sendquery=1&FORM=SCCODX`});
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openNewTab') {
        if (request.target.includes('gemini')) {
            askGemini(request.query);
        }
        if (request.target.includes('bingai')) {
            askBingAI(request.query);
        }
        if (request.target.includes('claude')) {
            askClaude(request.query);
        }
        sendResponse({ success: true });
    }
});
