const otherAge = document.getElementById('ages');
const classHidden = document.getElementsByClassName('hidden');

otherAge.addEventListener('change', () => {
    if (otherAge.value === 'Other') {
        for (let elm of classHidden) {
            elm.style.display = 'inline';
        }
    }
    else {
        for (let elm of classHidden) {
            elm.style.display = 'none';
        }
    }
});

const email = document.getElementById('email');
const emailMessage = document.getElementById('emailMessage');
email.addEventListener('change', () => {
    const emailValue = email.value;
    if (/^[^@]+@[^@]+\.[^@]+$/.test(emailValue)) {
        emailMessage.style.display = 'none';
    } else {
        emailMessage.style.display = 'block';
        emailMessage.textContent = "Invalid email";
    }
});

const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');

startDate.addEventListener('click', minDate);
endDate.addEventListener('click', minDate);

function minDate() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2,'0');
    const dd = String(today.getDate() + 1).padStart(2,'0');
    const yyyy = today.getFullYear();
    
    const todayString = `${yyyy}-${mm}-${dd}`;
    startDate.min = todayString;
    endDate.min =todayString;
}


