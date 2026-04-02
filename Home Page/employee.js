const API_URL = "http://localhost:8080/api";


<input id="firstname" placeholder="firstName">
<input id="lastname" placeholder="lastName">
<input type="date" id="dateOfBirth" placeholder="Date of birth">
<input id="address" placeholder="Adress">
<input id="zipcode" placeholder="ZipCode">
<input id="city" placeholder="City">
<input id="state" placeholder="State">
<input id="salary" placeholder="Salary">
<input id="wagerate" placeholder="Wagerate">
<input type="date" id="hiredate" placeholder="Hire date">
<input type="date" id="releaseddate" placeholder="Released date">


const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const dateOfBirth = document.getElementById("dateOfBirth);
const address = document.getElementById("address");
const zipcode = document.getElementById("zipcode");
const city = document.getElementById("city");
const state = document.getElementById("state");
const

signupBtn.addEventListener("click", async () => {

    message.textContent = "";

    if (!username.value || !password.value || !confirm.value) {
        message.textContent = "Please fill out all fields.";
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
            message.textContent = "New Account has been created for this employee, Please give them their employeeId";
            message.style.color = "green";

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