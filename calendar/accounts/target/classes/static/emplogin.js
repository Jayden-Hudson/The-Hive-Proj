const API_LOGIN = "http://localhost:8080/api/employees/login";

const employeecode = document.getElementById("employeecode");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", async () => {

    if (!employeecode.value || !password.value) {
        message.textContent = "Enter employee code and password";
        message.style.color = "red";
        return;
    }

    const loginData = {
        employeecode: parseInt(employeecode.value),
        password: password.value
    };

    try {
        const res = await fetch(API_LOGIN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        });

        if (res.ok) {
            const user = await res.json();

            message.textContent = "Login successful!";
            message.style.color = "green";

            console.log("Logged in user:", user);

            // redirect
            window.location.href = "dashboard.html";

        } else {
            const err = await res.text();
            message.textContent = err;
            message.style.color = "red";
        }

    } catch (err) {
        message.textContent = "Server error.";
        message.style.color = "red";
    }
});