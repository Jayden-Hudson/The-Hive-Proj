const API_URL = "http://localhost:8080/api";

const username = document.getElementById("username");
const password = document.getElementById("password");
const confirm = document.getElementById("confirmPassword");
const signupBtn = document.getElementById("signupBtn");
const message = document.getElementById("message");

signupBtn.addEventListener("click", async () => {

    message.textContent = "";

    if (!username.value || !password.value || !confirm.value) {
        message.textContent = "Please fill out all fields.";
        message.style.color = "red";
        return;
    }

    if (password.value !== confirm.value) {
        message.textContent = "Passwords do not match.";
        message.style.color = "red";
        return;
    }

    try {

        const res = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        });

        if (res.ok) {
            message.textContent = "Account created! Redirecting to login...";
            message.style.color = "green";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } else {
            message.textContent = "Error creating account.";
            message.style.color = "red";
        }

    } catch (error) {
        console.error(error);
        message.textContent = "Cannot connect to server.";
        message.style.color = "red";
    }

});