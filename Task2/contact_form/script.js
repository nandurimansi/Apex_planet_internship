document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();
    let errorMsg = document.getElementById("errorMsg");

    // Email validation pattern
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "" || email === "" || message === "") {
        errorMsg.textContent = "All fields are required.";
        return;
    }

    if (!emailPattern.test(email)) {
        errorMsg.textContent = "Please enter a valid email.";
        errorMsg.style.color = "red";
        return;
    }

    errorMsg.style.color = "green";
    errorMsg.textContent = "Form submitted successfully!";
});
