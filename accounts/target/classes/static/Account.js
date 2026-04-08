const API_URL = 'http://localhost:8080/api';

const API_URL = 'http://127.0.0.1:3000/account';

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmpassword = document.getElementById("confirmPassword");
const signupBtn = document.getElementById("signupBtn");
const signInBtn = document.getElementById("signInBtn");
const title = document.getElementById("title");
const message = document.getElementById("message");

// Set mode: 'signup' or 'login'
function setMode(mode) {
    if (mode === "signup") {
        title.innerText = "Create Account";
        confirmpassword.style.display = "block";
        message.innerText = "";
    } else {
        title.innerText = "Sign In";
        confirmpassword.style.display = "none";
        message.innerText = "";
    }
}

// Signup button
signupBtn.addEventListener("click", async () => {
    setMode("signup");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirm = confirmpassword.value.trim();

    if (!username || !password || !confirm) {
        message.innerText = "Please fill out all fields.";
        return;
    }

    if (password.length < 6) {
        message.innerText = "Password must be at least 6 characters.";
        return;
    }

    if (password !== confirm) {
        message.innerText = "Passwords do not match.";
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert("Account created! Please sign in.");
            usernameInput.value = "";
            passwordInput.value = "";
            confirmpassword.value = "";
            setMode("login"); // Switch to login after signup
        } else {
            const data = await response.json();
            message.innerText = data?.error?.message || "Error creating account.";
        }
    } catch (err) {
        console.error(err);
        message.innerText = "Error connecting to server.";
    }
});

// Login button
signInBtn.addEventListener("click", async () => {
    setMode("login");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        message.innerText = "Please enter username and password.";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const account = await res.json();

        if (res.ok && account && account.userid) {
            alert(`Welcome back, ${account.username}!`);
            usernameInput.value = "";
            passwordInput.value = "";
            message.innerText = "";
        } else {
            message.innerText = account?.error?.message || "Invalid username or password.";
        }
    } catch (err) {
        console.error(err);
        message.innerText = "Error connecting to server.";
    }
});