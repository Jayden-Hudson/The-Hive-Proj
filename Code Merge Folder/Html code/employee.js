const API_EMPLOYEES = "http://localhost:8080/api/employees";
//const API_DEPARTMENTS = "http://localhost:8080/api/departments";

const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const dob = document.getElementById("dob");
const address = document.getElementById("address");
const zipcode = document.getElementById("zipcode");
const city = document.getElementById("city");
const state = document.getElementById("state");
const salary = document.getElementById("salary");
const wagerate = document.getElementById("wagerate");
const hiredate = document.getElementById("hiredate");
const releaseddate = document.getElementById("releaseddate");
const password = document.getElementById("password");
const departmentSelect = document.getElementById("department");
//const managerSelect = document.getElementById("managerid");
const createBtn = document.getElementById("Create");
const message = document.getElementById("message");


async function loadDepartments() {
    const res = await fetch(API_DEPARTMENTS);
    const departments = await res.json();
    departments.forEach(dep => {
        const option = document.createElement("option");
        option.value = dep.departmentid;
        option.textContent = dep.departmentname;
        departmentSelect.appendChild(option);
    });
}

loadDepartments();


createBtn.addEventListener("click", async () => {
    message.textContent = "";

    if (
        !firstName.value || !lastName.value || !dob.value ||
        !address.value || !zipcode.value || !city.value || !state.value ||
        !salary.value || !wagerate.value || !hiredate.value ||
        !password.value || !departmentSelect.value
    ) {
        message.textContent = "Please fill out all required fields.";
        message.style.color = "red";
        return;
    }

    const employeeData = {
        firstname: firstName.value,
        lastname: lastName.value,
        dob: dob.value,
        address: address.value,
        zipcode: zipcode.value,
        city: city.value,
        state: state.value,
        salary: parseFloat(salary.value),
        wagerate: parseFloat(wagerate.value),
        hiredate: hiredate.value,
        releaseddate: releaseddate.value || null,
      // managerid: managerSelect.value ? parseInt(managerSelect.value) : null
        departmentid: parseInt(departmentSelect.value),
        password: password.value
    };


    try {
        const empResponse = await fetch(API_EMPLOYEES, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData)
        });

        if (empResponse.ok) {
            message.textContent = "Employee created successfully!";
            message.style.color = "green";
            document.getElementById("employeeForm").reset();
        } else {
            const empError = await empResponse.text();
            message.textContent = "Employee Error: " + empError;
            message.style.color = "red";
        }

    } catch (error) {
        console.error("Connection Error:", error);
        message.textContent = "Cannot connect to server. Check if backend is running.";
        message.style.color = "red";
    }
});