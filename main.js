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
// 2. STRIPE-STYLE ACCORDION CONTROLLER
// ==========================================
function switchAccordion(selectedMethod) {
    // Force set corresponding hidden radio button input state to true
    const targetRadio = document.getElementById(`radio-${selectedMethod}`);
    if (targetRadio) targetRadio.checked = true;

    // Toggle panels visibility
    const methods = ['momo', 'card', 'bank'];
    methods.forEach(method => {
        const panel = document.getElementById(`panel-${method}`);
        if (panel) {
            if (method === selectedMethod) {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        }
    });
}

// ==========================================
// 3. BACKEND CONNECTIONS (VOLUNTEER & ACCORDION DONATIONS)
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

// --- Dynamic Dynamic Accordion Submission Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const donateSection = document.getElementById('donate');
    
    if (donateSection) {
        donateSection.addEventListener('click', async (e) => {
            // Check if the clicked target element is one of our payment buttons
            if (e.target && e.target.tagName === 'BUTTON' && e.target.classList.contains('btn-secondary')) {
                e.preventDefault();
                
                // Track down which option is currently selected
                const activeRadio = document.querySelector('input[name="payMethod"]:checked');
                if (!activeRadio) return;
                
                const paymentMethod = activeRadio.id.replace('radio-', ''); // 'momo', 'card', or 'bank'
                const panel = document.getElementById(`panel-${paymentMethod}`);
                
                // Dynamic Payload Construction based on open card context
                let payload = { paymentMethod: paymentMethod };
                let amount = 0;

                if (paymentMethod === 'momo') {
                    const inputs = panel.querySelectorAll('input');
                    const select = panel.querySelector('select');
                    
                    payload.firstName = inputs[0].value;
                    payload.lastName = inputs[1].value;
                    payload.email = inputs[2].value;
                    payload.phoneNumber = `${select.value}${inputs[3].value.replace(/\s+/g, '')}`;
                    amount = inputs[4].value;
                } 
                else if (paymentMethod === 'card') {
                    const inputs = panel.querySelectorAll('input');
                    
                    payload.firstName = inputs[0].value;
                    payload.lastName = inputs[1].value;
                    payload.email = inputs[2].value;
                    payload.cardNumber = inputs[3].value;
                    payload.cardExpiry = inputs[4].value;
                    payload.cardCvc = inputs[5].value;
                    amount = inputs[6].value;
                } 
                else if (paymentMethod === 'bank') {
                    const inputs = panel.querySelectorAll('input');
                    payload.fullName = inputs[0].value;
                    payload.email = inputs[1].value;
                    amount = 0; // Wire instruction triggers default placeholder email
                }

                payload.amount = parseFloat(amount) || 0;

                // Validate basic amounts for non-wire transfers
                if (paymentMethod !== 'bank' && (!payload.amount || payload.amount <= 0)) {
                    alert("Please enter a valid amount first.");
                    return;
                }

                // Verify basic email input is filled out safely
                if (!payload.email) {
                    alert("Please provide your email address to log transaction tokens.");
                    return;
                }

                try {
                    const response = await fetch('https://future-light-backend.onrender.com/api/donate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const data = await response.json();
                    alert(data.message || "Request initialized successfully!");
                    
                    // Clear inputs inside the active block safely on success 
                    if (response.ok) {
                        panel.querySelectorAll('input').forEach(input => input.value = '');
                    }
                } catch (error) {
                    console.error("Error Processing Donation:", error);
                    alert("Could not process donation request securely at this time.");
                }
            }
        });
    }
});
