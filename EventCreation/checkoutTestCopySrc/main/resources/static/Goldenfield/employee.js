const API_EMPLOYEES = "http://localhost:8080/api/employees";
const API_DEPARTMENTS = "http://localhost:8080/api/departments";

const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
//const dob = document.getElementById("dob");
const address = document.getElementById("address");
const zipcode = document.getElementById("zipcode");
const city = document.getElementById("city");
const state = document.getElementById("state");
//const salary = document.getElementById("salary");
//const wagerate = document.getElementById("wagerate");
//const hiredate = document.getElementById("hiredate");
//const releaseddate = document.getElementById("releaseddate");
const password = document.getElementById("password");
const departmentSelect = document.getElementById("department");
const employeecode = document.getElementById("employeecode");

const createBtn = document.getElementById("Create");
const message = document.getElementById("message");



// DEPARTMENTS
async function loadDepartments() {
    try {
        const res = await fetch(API_DEPARTMENTS);
        const departments = await res.json();

        departmentSelect.innerHTML = `
            <option value="" disabled selected>Select Department</option>
        `;

        departments.forEach(dep => {
            const option = document.createElement("option");
            option.value = dep.departmentid;
            option.textContent = dep.departmentname;
            departmentSelect.appendChild(option);
        });

    } catch (err) {
        console.error("Failed to load departments:", err);
        message.textContent = "Failed to load departments.";
        message.style.color = "red";
    }
}

loadDepartments();


createBtn.addEventListener("click", async () => {

    if (
        !firstName.value || !lastName.value ||
        !address.value || !zipcode.value || !city.value || !state.value ||
        !password.value || !departmentSelect.value || !employeecode.value
    ) {
        message.textContent = "Please fill out all fields.";
        message.style.color = "red";
        return;
    }

    const employeeData = {
        firstname: firstName.value,
        lastname: lastName.value,
        address: address.value,
        zipcode: zipcode.value,
        city: city.value,
        state: state.value,
        departmentid: parseInt(departmentSelect.value),
        password: password.value,
        employeecode: parseInt(employeecode.value)
    };

    try {
        const res = await fetch(API_EMPLOYEES, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData)
        });

        if (res.ok) {
            message.textContent = "Employee created successfully!";
            message.style.color = "green";
            document.getElementById("employeeForm").reset();
        } else {
            const err = await res.text();
            message.textContent = err;
            message.style.color = "red";
        }

    } catch (err) {
        message.textContent = "Server connection error.";
        message.style.color = "red";
    }
});
