// ==========================================
// 1. MOBILE NAVIGATION MENU LOGIC
// ==========================================
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}


// ==========================================
// 2. BACKEND CONNECTIONS (VOLUNTEER & DONATION)
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
            // Updated to live Render backend cloud URL
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


// --- Handle Donation Button Click ---
const donateBtn = document.getElementById('donateBtn');

if (donateBtn) {
    donateBtn.addEventListener('click', async () => {
        const amountInput = document.getElementById('donationAmount');
        const methodInput = document.getElementById('paymentMethod');
        const phoneInput = document.getElementById('phoneNumber');

        const amount = amountInput ? amountInput.value : 0;
        const paymentMethod = methodInput ? methodInput.value : 'momo';
        const phoneNumber = phoneInput ? phoneInput.value : '';

        if (!amount || amount <= 0) {
            alert("Please enter a valid amount first.");
            return;
        }

        try {
            // Updated to live Render backend cloud URL
            const response = await fetch('https://future-light-backend.onrender.com/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    amount: parseFloat(amount),
                    paymentMethod: paymentMethod,
                    phoneNumber: phoneNumber
                })
            });

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("Error:", error);
            alert("Could not process donation request.");
        }
    });
}
