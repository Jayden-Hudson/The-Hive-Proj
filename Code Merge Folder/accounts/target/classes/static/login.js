const API_URL = "http://localhost:8080/api";

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", async () => {

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    message.textContent = "";

    if (!username || !password) {
        message.textContent = "Please enter username and password.";
        message.style.color = "red";
        return;
    }

    try {

        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const account = await res.json();

        if (res.ok && account && account.username) {
            message.textContent = `Welcome ${account.username}!`;
            message.style.color = "green";

            setTimeout(() => {
                          window.location.href = "home.html";
                      }, 1500);

        } else {
            message.textContent = "Invalid username or password.";
            message.style.color = "red";
        }

    } catch (error) {
        console.error(error);
        message.textContent = "Server connection error.";
        message.style.color = "red";
    }

});