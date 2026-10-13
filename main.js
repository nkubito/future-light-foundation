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
    const input = document.getElementById('global-amount');
    const amount = Number(input.value);
    if (!Number.isSafeInteger(amount) || amount <= 0) {
        alert("Please enter a valid whole-number donation amount in RWF.");
        input.focus();
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
    document.getElementById('don-step-2').style.display = 'none';
    document.getElementById('don-step-3').style.display = 'block';
    const amount = Number(document.getElementById('global-amount').value);
    document.getElementById('momo-donation-amount').textContent =
        new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(amount);
    const receiptLink = document.getElementById('email-donation-receipt');
    const subject = encodeURIComponent('Future Light donation transaction reference');
    const body = encodeURIComponent(
        'Hello Future Light Foundation,\n\nI sent a donation of RWF ' + amount.toLocaleString('en-RW') +
        ' to 0792157588. My mobile money transaction reference is: [enter reference here].\n\nPlease verify receipt.\n'
    );
    receiptLink.href = 'mailto:foundationfuturelight@gmail.com?subject=' + subject + '&body=' + body;
}

function copyDonationNumber() {
    const number = '0792157588';
    const status = document.getElementById('copy-number-status');
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        window.prompt('Copy this Mobile Money number:', number);
        return;
    }
    navigator.clipboard.writeText(number).then(() => {
        status.textContent = 'Number copied.';
    }).catch(() => {
        window.prompt('Copy this Mobile Money number:', number);
    });
}

function backToStep2() {
    document.getElementById('don-step-3').style.display = 'none';
    document.getElementById('don-step-2').style.display = 'block';
}

// --- Quick Selector Autofill Assistant ---
function selectQuickAmount(val) {
    const amountInput = document.getElementById('global-amount');
    if (amountInput) {
        amountInput.value = val;
        // Instantly transition forward to choose the payment method
        toStep2();
    }
}

// --- Team Card Toggle Feature ---
function toggleTeamCard(cardElement) {
    const details = cardElement.querySelector('.team-details');
    const indicator = cardElement.querySelector('.expand-indicator i');
    
    // Check if this card is already expanded
    const isExpanded = cardElement.classList.contains('expanded');
    
    // Collapse any open team cards first
    document.querySelectorAll('.team-card').forEach(card => {
        card.classList.remove('expanded');
        const cardDetails = card.querySelector('.team-details');
        const cardIndicator = card.querySelector('.expand-indicator i');
        if (cardDetails) {
            cardDetails.style.maxHeight = '0';
            cardDetails.style.opacity = '0';
        }
        if (cardIndicator) {
            cardIndicator.className = 'fas fa-chevron-down';
        }
    });

    // If it wasn't expanded, open it cleanly
    if (!isExpanded && details) {
        cardElement.classList.add('expanded');
        details.style.maxHeight = details.scrollHeight + 'px';
        details.style.opacity = '1';
        if (indicator) {
            indicator.className = 'fas fa-chevron-up';
        }
    }
}

// Make functions globally available for inline HTML onclick attributes
window.toStep2 = toStep2;
window.toStep1 = toStep1;
window.toStep3 = toStep3;
window.copyDonationNumber = copyDonationNumber;
window.backToStep2 = backToStep2;
window.selectQuickAmount = selectQuickAmount;
window.toggleTeamCard = toggleTeamCard;

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

// Mobile Money donations are manual while an automated payment provider is unavailable.
// This page never collects card details or reports a transfer as automatically confirmed.
