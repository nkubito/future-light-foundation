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
const volunteerForm = document.querySelector('#volunteer form');

if (volunteerForm) {
    volunteerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the page from reloading

        // 1. Grab values from the input fields
        const fullName = volunteerForm.querySelector('input[placeholder="Full Name"]').value;
        const email = volunteerForm.querySelector('input[placeholder="Email Address"]').value;
        const skills = volunteerForm.querySelector('textarea').value;

        try {
            // 2. Send the data to the backend server
            const response = await fetch('http://localhost:5000/api/volunteer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, skills })
            });

            const data = await response.json();
            
            // 3. Show the server's response to the user
            if (data.success) {
                alert(data.message);
                volunteerForm.reset(); // Clear the form fields
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
