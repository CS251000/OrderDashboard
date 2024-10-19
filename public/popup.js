// popup.js

// Function to handle the extract button click
document.getElementById('extract-button').addEventListener('click', () => {
    // Send a message to content.js to start extracting data
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'extractData' });
    });
});

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.totalAmount) {
        // Display the total amount in your popup
        const totalAmountDisplay = document.getElementById('total-amount');
        if (totalAmountDisplay) {
            totalAmountDisplay.textContent = `Total Amount: ${message.totalAmount}`;
        }
    }
});
