// Google Pay Integration

// ============================================
// GOOGLE PAY CONFIGURATION
// ============================================

/**
 * Define the version of the Google Pay API referenced when creating your
 * configuration
 */
const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
};

/**
 * Card networks supported by your site and your gateway
 */
const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];

/**
 * Card authentication methods supported by your site and your gateway
 */
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

/**
 * Identify your gateway and your site's gateway merchant identifier
 * Using Adyen as the payment gateway
 */
// const tokenizationSpecification = {
//     type: 'PAYMENT_GATEWAY',
//     parameters: {
//         'gateway': 'adyen',
//         'gatewayMerchantId': 'ZohoCorp_Platform_TEST'
//     }
// };

//DIRECT INTEGRATION DETAILS
const tokenizationSpecification = {
    type: 'DIRECT',
    parameters: {
      'protocolVersion': 'ECv2',
      'publicKey': 'BJVEtluJua9pfbf+b78Pqmy6ZFyzrx0cZI50k60z3tpHRcZJlyd2k8FDaJHWQOf5ggnfXPh/XkYZMtOhe9cE/uQ='
    }
  };

/**
 * Describe your site's support for the CARD payment method and its required fields
 */
const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks
    }
};

/**
 * Describe your site's support for the CARD payment method including optional fields
 */
const cardPaymentMethod = Object.assign(
    {},
    baseCardPaymentMethod,
    {
        tokenizationSpecification: tokenizationSpecification
    }
);

/**
 * An initialized google.payments.api.PaymentsClient object or null if not yet set
 */
let paymentsClient = null;

/**
 * Configure your site's support for payment methods supported by the Google Pay API
 */
function getGoogleIsReadyToPayRequest() {
    return Object.assign(
        {},
        baseRequest,
        {
            allowedPaymentMethods: [baseCardPaymentMethod]
        }
    );
}

/**
 * Configure support for the Google Pay API
 */
function getGooglePaymentDataRequest() {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
    paymentDataRequest.merchantInfo = {
        merchantId: '12345678901234567890',
        merchantName: 'Example Merchant'
    };
    return paymentDataRequest;
}

/**
 * Return an active PaymentsClient or initialize
 */
function getGooglePaymentsClient() {
    if (paymentsClient === null) {
        console.log('Initializing Google Pay Client');
        paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });
    }
    return paymentsClient;
}

/**
 * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
 */
function onGooglePayLoaded() {
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
        .then(function(response) {
            if (response.result) {
                addGooglePayButton();
            } else {
                showGooglePayError('Google Pay is not available on this device/browser.');
            }
        })
        .catch(function(err) {
            console.error('Google Pay initialization error:', err);
            showGooglePayError('Unable to initialize Google Pay. Please try again later.');
        });
}

/**
 * Add a Google Pay purchase button
 * Following brand guidelines: https://developers.google.com/pay/api/web/guides/brand-guidelines
 */
function addGooglePayButton() {
    const paymentsClient = getGooglePaymentsClient();
    const button = paymentsClient.createButton({
        onClick: onGooglePaymentButtonClicked,
        allowedPaymentMethods: [baseCardPaymentMethod],
        // Brand Guidelines: Use light buttons on dark backgrounds
        buttonColor: 'white',
        // 'buy' shows "Buy with G Pay" text
        buttonType: 'buy',
        // Custom corner radius to match your UI
        buttonRadius: 8,
        buttonSizeMode: 'static'
    });
    
    const container = document.getElementById('container');
    container.innerHTML = '';
    container.appendChild(button);
}

/**
 * Show error message if Google Pay is not available
 */
function showGooglePayError(message) {
    const container = document.getElementById('container');
    container.innerHTML = `
        <div style="padding: 20px; background: rgba(255, 69, 58, 0.1); border: 1px solid #ff453a; border-radius: 12px; color: #ff453a; text-align: center;">
            <p style="margin: 0;">${message}</p>
        </div>
    `;
}

/**
 * Provide Google Pay API with a payment amount, currency, and amount status
 */
function getGoogleTransactionInfo() {
    return {
        countryCode: 'US',
        currencyCode: 'USD',
        totalPriceStatus: 'FINAL',
        totalPrice: currentTotal.toFixed(2)
    };
}

/**
 * Prefetch payment data to improve performance
 */
function prefetchGooglePaymentData() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = {
        totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
        currencyCode: 'USD'
    };
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.prefetchPaymentData(paymentDataRequest);
}

/**
 * Show Google Pay payment sheet when Google Pay payment button is clicked
 */
function onGooglePaymentButtonClicked() {
    // Validate form before proceeding
    if (!validateForm()) {
        return;
    }
    
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
    
    const paymentsClient = getGooglePaymentsClient();
    console.log('Loading payment data');
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(function(paymentData)
        {
            console.log('Payment data loaded successfully');
            processPayment(paymentData);
        })
        .catch(function(err) {
            console.log('=== GOOGLE PAY ERROR ===');
            console.log('Error object:', err);
            console.log('Error type:', typeof err);
            console.log('Error keys:', Object.keys(err));
            if (err.statusCode === 'CANCELED') {
                console.log('Payment cancelled by user');
            } else {
                console.error('Payment error:', err);
            }
        });
}

/**
 * Store payment data for order placement
 */
let storedPaymentData = null;

/**
 * Process payment data returned by the Google Pay API
 * Shows Order Review instead of directly completing the order
 */
function processPayment(paymentData) {
    console.log("Payment data:", paymentData);
    
    // Store payment data for later use
    storedPaymentData = paymentData;
    
    const paymentToken = paymentData.paymentMethodData.tokenizationData.token;
    console.log('Payment Token:', paymentToken);
    
    // Get card description for display
    const cardNetwork = paymentData.paymentMethodData.info.cardNetwork;
    const cardDetails = paymentData.paymentMethodData.info.cardDetails;
    const paymentDescription = `${cardNetwork} •••• ${cardDetails}`;
    
    // Update review modal with payment info
    document.getElementById('paymentDescription').textContent = paymentDescription;
    
    // Update Ship To address in review
    const shipToAddress = document.getElementById('shipToAddress');
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    
    shipToAddress.textContent = `${firstName} ${lastName}, ${address}...`;
    
    // Update total in review (in case promo was applied)
    document.getElementById('reviewTotal').textContent = `$${currentTotal.toFixed(2)}`;
    
    // Check if discount was applied
    const discountRow = document.getElementById('discountRow');
    const reviewDiscount = document.getElementById('reviewDiscount');
    if (discountRow && discountRow.style.display !== 'none') {
        const discountAmount = discountRow.querySelector('span:last-child').textContent;
        reviewDiscount.style.display = 'flex';
        document.getElementById('reviewDiscountAmount').textContent = discountAmount;
    } else {
        reviewDiscount.style.display = 'none';
    }
    
    // Show review modal
    const reviewModal = document.getElementById('reviewModal');
    reviewModal.classList.add('active');
}

/**
 * Place the order after review
 */
function placeOrder() {
    if (!storedPaymentData) {
        console.error('No payment data available');
        return;
    }
    
    // Here you would typically send the payment token to your server
    const paymentToken = storedPaymentData.paymentMethodData.tokenizationData.token;
    console.log('Placing order with token:', paymentToken);
    
    // Close review modal
    document.getElementById('reviewModal').classList.remove('active');
    
    // Show success modal
    const successModal = document.getElementById('successModal');
    const orderNum = document.getElementById('orderNum');
    orderNum.textContent = Math.random().toString(36).substring(2, 8).toUpperCase();
    successModal.classList.add('active');
    
    // Clear stored payment data
    storedPaymentData = null;
}

// Initialize review modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Place Order button
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }
    
    // Close review modal on outside click
    const reviewModal = document.getElementById('reviewModal');
    if (reviewModal) {
        reviewModal.addEventListener('click', function(e) {
            if (e.target === reviewModal) {
                reviewModal.classList.remove('active');
                storedPaymentData = null;
            }
        });
    }
});

