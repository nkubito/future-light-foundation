// ==========================================
// 1. MOBILE NAVIGATION MENU LOGIC
// ==========================================
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Close menu on link click (mobile)
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
        e.preventDefault(); // This stops the page from reloading and breaking the connection!

        // Grab values cleanly using IDs
        const fullName = document.getElementById('volunteerName').value;
        const email = document.getElementById('volunteerEmail').value;
        const skills = document.getElementById('volunteerSkills').value;

        try {
            const response = await fetch('http://localhost:5000/api/volunteer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, skills })
            });

            const data = await response.json();
            
            if (data.success) {
                alert(data.message);
                volunteerForm.reset(); // Clears out the form inputs
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
        const amount = amountInput ? amountInput.value : 0;

        if (!amount || amount <= 0) {
            alert("Please enter a valid amount first.");
            return;
        }

        try {
            // Send the donation amount to the backend
            const response = await fetch('http://localhost:5000/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(amount) })
            });

            const data = await response.json();
            alert(`${data.message}\nMerchant Number: ${data.paymentNumber}`);
        } catch (error) {
            console.error("Error:", error);
            alert("Could not process donation request.");
        }
    });
}
