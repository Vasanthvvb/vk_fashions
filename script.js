// Checkout Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    prefillFormData();
    initFormValidation();
    initPromoCode();
});

// ============================================
// PREFILL FORM DATA
// ============================================

function prefillFormData() {
    console.log('Prefilling form data...');
    
    // Set each field directly
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const address2 = document.getElementById('address2');
    const city = document.getElementById('city');
    const state = document.getElementById('state');
    const zip = document.getElementById('zip');

    if (email) email.value = 'john.doe@example.com';
    if (phone) phone.value = '+1 (555) 123-4567';
    if (firstName) firstName.value = 'John';
    if (lastName) lastName.value = 'Doe';
    if (address) address.value = '123 Main Street';
    if (address2) address2.value = 'Apt 4B';
    if (city) city.value = 'New York';
    if (state) state.value = 'NY';
    if (zip) zip.value = '10001';

    console.log('Form prefilled successfully');
}

// ============================================
// SHARED STATE (used by Google Pay)
// ============================================

/**
 * Current total price (can be updated by promo codes)
 * This is accessed by googlepay.js
 */
let currentTotal = 299.97;

// ============================================
// FORM VALIDATION
// ============================================

function initFormValidation() {
    const inputs = document.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateInput(input);
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    
    if (!value) {
        isValid = false;
    } else if (input.type === 'email') {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    
    if (isValid) {
        input.classList.remove('error');
        input.style.borderColor = '';
    } else {
        input.classList.add('error');
        input.style.borderColor = '#ff453a';
    }
    
    return isValid;
}

function validateForm() {
    const requiredInputs = document.querySelectorAll('input[required]');
    let allValid = true;
    
    requiredInputs.forEach(input => {
        if (!validateInput(input)) {
            allValid = false;
        }
    });
    
    if (!allValid) {
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
    
    return allValid;
}

// ============================================
// PROMO CODE
// ============================================

function initPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const applyBtn = document.getElementById('applyPromo');
    const discountRow = document.getElementById('discountRow');
    const totalPrice = document.getElementById('totalPrice');
    
    const promoCodes = {
        'SAVE10': { discount: 10, type: 'percent' },
        'SAVE20': { discount: 20, type: 'percent' },
        'FLAT25': { discount: 25, type: 'fixed' }
    };
    
    applyBtn.addEventListener('click', () => {
        const code = promoInput.value.toUpperCase().trim();
        
        if (promoCodes[code]) {
            const promo = promoCodes[code];
            let discount = 0;
            const subtotal = 259.97;
            
            if (promo.type === 'percent') {
                discount = subtotal * (promo.discount / 100);
            } else {
                discount = promo.discount;
            }
            
            currentTotal = 299.97 - discount;
            
            discountRow.style.display = 'flex';
            discountRow.querySelector('span:last-child').textContent = `-$${discount.toFixed(2)}`;
            totalPrice.textContent = `$${currentTotal.toFixed(2)}`;
            
            applyBtn.textContent = 'Applied!';
            applyBtn.style.background = '#34c759';
            applyBtn.style.borderColor = '#34c759';
            applyBtn.style.color = 'white';
            promoInput.disabled = true;
            promoInput.style.borderColor = '#34c759';
        } else if (code) {
            promoInput.style.borderColor = '#ff453a';
            applyBtn.textContent = 'Invalid';
            applyBtn.style.background = 'rgba(255, 69, 58, 0.1)';
            applyBtn.style.borderColor = '#ff453a';
            applyBtn.style.color = '#ff453a';
            
            setTimeout(() => {
                applyBtn.textContent = 'Apply';
                applyBtn.style.background = '';
                applyBtn.style.borderColor = '';
                applyBtn.style.color = '';
                promoInput.style.borderColor = '';
            }, 2000);
        }
    });
    
    promoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyBtn.click();
        }
    });
}

// ============================================
// MODAL HANDLING
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('successModal');
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// ============================================
// BACKGROUND EFFECT
// ============================================

document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
});
