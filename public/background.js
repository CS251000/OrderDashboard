chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'sendOrderDetails') {
        fetch(message.apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token fd186514ba9efe62ed8043bd5c1eff75aa88c235`
            }
        })
        .then(response => response.json())
        .then(data => {
            sendResponse({ status: 'success', data });
        })
        .catch(error => {
            sendResponse({ status: 'error', message: error.message });
        });

        return true;
    }
});
