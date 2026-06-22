// ==========================================
// 1. MOBILE NAVIGATION & DROPDOWN LOGIC
// ==========================================
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links > a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}

// ==========================================
// 2. INTERNATIONAL 3-STEP DONATION NAVIGATION
// ==========================================
let selectedMethodTracker = ''; // Tracks chosen method ('momo', 'card', 'bank')

function toStep2() {
    const amount = document.getElementById('global-amount').value;
    if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid donation amount first.");
        return;
    }
    document.getElementById('don-step-1').style.display = 'none';
    document.getElementById('don-step-2').style.display = 'block';
    document.getElementById('don-step-3').style.display = 'none';
}

function toStep1() {
    document.getElementById('don-step-2').style.display = 'none';
    document.getElementById('don-step-1').style.display = 'block';
}

function toStep3(method) {
    selectedMethodTracker = method;
    document.getElementById('don-step-2').style.display = 'none';
    document.getElementById('don-step-3').style.display = 'block';

    // Hide all input parameter blocks initially
    document.getElementById('fields-momo').style.display = 'none';
    document.getElementById('fields-card').style.display = 'none';
    document.getElementById('fields-bank').style.display = 'none';

    // Dynamically reveal only the chosen fields screen
    document.getElementById(`fields-${method}`).style.display = 'block';
}

function backToStep2() {
    document.getElementById('don-step-3').style.display = 'none';
    document.getElementById('don-step-2').style.display = 'block';
}

// Make functions globally available for inline HTML onclick attributes
window.toStep2 = toStep2;
window.toStep1 = toStep1;
window.toStep3 = toStep3;
window.backToStep2 = backToStep2;

// ==========================================
// 3. BACKEND CONNECTIONS & SUBMISSIONS
// ==========================================

// --- Handle Volunteer Form Submission ---
const volunteerForm = document.getElementById('volunteerForm');

if (volunteerForm) {
    volunteerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const fullName = document.getElementById('volunteerName').value;
        const email = document.getElementById('volunteerEmail').value;
        const skills = document.getElementById('volunteerSkills').value;

        try {
            const response = await fetch('https://future-light-backend.onrender.com/api/volunteer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, skills })
            });

            const data = await response.json();
            
            if (data.success) {
                alert(data.message);
                volunteerForm.reset(); 
            } else {
                alert("Something went wrong: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Could not connect to the backend server. Is it running?");
        }
    });
}

// --- Handle Dynamic 3-Step Donation Submission ---
document.addEventListener('DOMContentLoaded', () => {
    const dynamicPayForm = document.getElementById('dynamic-payment-form');
    
    if (dynamicPayForm) {
        dynamicPayForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const amount = document.getElementById('global-amount').value;
            let payload = { 
                paymentMethod: selectedMethodTracker,
                amount: parseFloat(amount) || 0 
            };

            // Read variables directly based on the active chosen branch
            if (selectedMethodTracker === 'momo') {
                payload.firstName = document.getElementById('momo-first').value;
                payload.lastName = document.getElementById('momo-last').value;
                payload.email = document.getElementById('momo-email').value;
                const dialCode = document.getElementById('momo-country').value;
                const localNum = document.getElementById('momo-phone').value;
                payload.phoneNumber = `${dialCode}${localNum.replace(/\s+/g, '')}`;
            } 
            else if (selectedMethodTracker === 'card') {
                payload.firstName = document.getElementById('card-first').value;
                payload.lastName = document.getElementById('card-last').value;
                payload.email = document.getElementById('card-email').value;
                payload.cardNumber = document.getElementById('card-number').value;
                payload.cardExpiry = document.getElementById('card-expiry').value;
                payload.cardCvc = document.getElementById('card-cvc').value;
            } 
            else if (selectedMethodTracker === 'bank') {
                payload.fullName = document.getElementById('bank-name').value;
                payload.email = document.getElementById('bank-email').value;
                payload.amount = 0; // Wire transfers utilize direct instruction emails
            }

            // Fallback validation checks before pushing upstream
            if (selectedMethodTracker !== 'bank' && (!payload.amount || payload.amount <= 0)) {
                alert("Please select a valid amount first.");
                return;
            }

            if (!payload.email) {
                alert("Please supply an email address.");
                return;
            }

            try {
                const response = await fetch('https://future-light-backend.onrender.com/api/donate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                alert(data.message || "Thank you! Transaction processed.");
                
                if (response.ok) {
                    // Reset everything cleanly and slide back to Step 1
                    dynamicPayForm.reset();
                    document.getElementById('global-amount').value = '';
                    toStep1();
                }
            } catch (error) {
                console.error("Error Processing Donation:", error);
                alert("Could not process donation request securely at this time.");
            }
        });
    }
});
