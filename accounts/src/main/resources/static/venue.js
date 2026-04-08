<div id="message"></div> <!-- place this below your button -->

<script>
const API_URL = "http://localhost:8080/api/venues"; // your backend endpoint

const nameInput = document.getElementById("name");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");
const capacityInput = document.getElementById("capacity"); // optional

const createBtn = document.getElementById("Create");
const message = document.getElementById("message");

createBtn.addEventListener("click", async () => {

    message.textContent = "";

    // Simple validation
    if (!nameInput.value || !addressInput.value || !cityInput.value || !stateInput.value) {
        message.textContent = "Please fill out all required fields.";
        message.style.color = "red";
        return;
    }

    const newVenue = {
        name: nameInput.value.trim(),
        address: addressInput.value.trim(),
        city: cityInput.value.trim(),
        state: stateInput.value.trim(),
        capacity: capacityInput.value ? parseInt(capacityInput.value) : undefined
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newVenue)
        });

        if (res.ok) {
            message.textContent = "Venue has been created!";
            message.style.color = "green";

            // Optional: redirect after 1.5 seconds
            setTimeout(() => {
                window.location.href = "venues.html"; // or wherever you want
            }, 1500);

        } else {
            message.textContent = "Error creating venue.";
            message.style.color = "red";
        }

    } catch (error) {
        console.error(error);
        message.textContent = "Cannot connect to server.";
        message.style.color = "red";
    }
});
</script>