chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractData') {
        console.log('Extract Data message received.');
        extractOrderDetails();
    }
});

function extractOrderDetails() {
    const pickupFromLabel = Array.from(document.querySelectorAll('label'))
        .find(label => label.textContent.trim().toLowerCase() === 'pickup from');
    const pickupFromValue = pickupFromLabel 
        ? pickupFromLabel.nextElementSibling.textContent.trim() 
        : 'Not found';
    
    const deliverToLabel = Array.from(document.querySelectorAll('label'))
        .find(label => label.textContent.trim().toLowerCase() === 'deliver to');
    const deliverToValue = deliverToLabel 
        ? deliverToLabel.nextElementSibling.textContent.trim() 
        : 'Not found';
    
    const paymentModeLabel = Array.from(document.querySelectorAll('label'))
        .find(label => label.textContent.trim().toLowerCase() === 'payment mode');
    const paymentModeValue = paymentModeLabel 
        ? paymentModeLabel.nextElementSibling.textContent.trim() 
        : 'Not found';
    
    const weightLabel = Array.from(document.querySelectorAll('label'))
        .find(label => label.textContent.trim().toLowerCase() === 'applicable weight (in kg)');
    const weightValue = weightLabel 
        ? weightLabel.nextElementSibling.textContent.trim() 
        : 'Not found';

    console.log('Pickup From:', pickupFromValue);
    console.log('Deliver To:', deliverToValue);
    console.log('Payment Mode:', paymentModeValue);
    console.log('Applicable Weight:', weightValue);

    // Extract pin codes from pickup and delivery locations
    const pinCodeRegex = /\b\d{6}\b/;
    const originPinMatch = pickupFromValue.match(pinCodeRegex);
    const destinationPinMatch = deliverToValue.match(pinCodeRegex);
    const originPin = originPinMatch ? originPinMatch[0] : 'Not found';
    const destinationPin = destinationPinMatch ? destinationPinMatch[0] : 'Not found';

    const chargeableWeight = parseFloat(weightValue) * 1000; // Convert kg to grams
    const status = 'Delivered'; 
    const billingMode = paymentModeValue === 'Prepaid' ? 'S' : 'E';
    const codAmount = paymentModeValue === 'Prepaid' ? '0' : '1';
    const ptfinal= paymentModeValue==='Prepaid'?"Pre-paid":"";

    sendOrderDetailsToAPI({
        md: billingMode,
        cgm: chargeableWeight,
        o_pin: originPin,
        d_pin: destinationPin,
        ss: status,
        pt: ptfinal,
        cod: codAmount
    });
}

function sendOrderDetailsToAPI(orderDetails) {
    const apiUrl = `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=${orderDetails.md}&ss=${orderDetails.ss}&d_pin=${orderDetails.d_pin}&o_pin=${orderDetails.o_pin}&cgm=${orderDetails.cgm}&pt=${orderDetails.pt}&cod=${orderDetails.cod}`;
    console.log(apiUrl);

    chrome.runtime.sendMessage(
        { action: 'sendOrderDetails', apiUrl },
        (response) => {
            if (chrome.runtime.lastError) {
                console.error('Chrome runtime error:', chrome.runtime.lastError);
                return;
            }

            if (response.status === 'success') {
                console.log('API Response:', response.data);
                chrome.runtime.sendMessage({ totalAmount: response.data[0].total_amount });
            } else {
                console.error('Error sending data to the API:', response.message);
            }
        }
    );
}
