/* checkoutEmail: checkoutEmail.value,
confirmEmail: confirmEmail.value,
firstName: firstName.value,
lastName: lastName.value,
phone: phone.value,
address: address.value,
city: city.value,
state: state.value,
zip: zip.value,
cardNumber: cardNumber.value,
expirationMonth: expirationMonth.value,
expirationYear: expirationYear.value,
cvv: cvv.value,
addPass: addPass.value,
declinePass: declinePass.value,
addProtection: addProtection.value,
declineProtection: declineProtection.value,
ticketPrice: ticketPrice.value,
salesTax: salesTax.value,
parkingPrice: parkingPrice.value,
protectionPrice: protectionPrice.value,
orderTotal: orderTotal.value */
previousSlideButton.addEventListener('click', prevSlide);

//slide 1
checkoutEmail.addEventListener('blur', checkEmailsMatch);
confirmEmail.addEventListener('blur', checkEmailsMatch);
checkoutEmail.addEventListener('blur', isValidEmail);
phone.addEventListener('input', isValidPhone);
//slide 1
let emailsMatch = false;
let emailIsValid = false;
let phoneIsValid = false;
//slide 2
let zipIsValid = false;
let cardIsValid = false;
let cvvIsValid  = false;
//slide 2
cardNumber.addEventListener('input', isValidCard);
zip.addEventListener('input', isValidZip);
cvv.addEventListener('input', isValidCvv);

//slide 3
declinePass.addEventListener('change', () => enforceOneChecked(declinePass, addPass));
addPass.addEventListener('change', () => enforceOneChecked(addPass, declinePass));
declineProtection.addEventListener('change', () => enforceOneChecked(declineProtection, addProtection));
addProtection.addEventListener('change', () => enforceOneChecked(addProtection, declineProtection));

const numberOfTickets = 0;
const pricePerTicket = 49.95
const salesTaxRate = 9.875;
const totalOfAllPrices = 0;
const calcPassPrice =  0;
const calcProtectionPrice = 0;

declinePass.addEventListener('change', getPassPrice);
addPass.addEventListener('change', getPassPrice);

declineProtection.addEventListener('change', getProtectionPrice);
addProtection.addEventListener('change', getProtectionPrice);

function getPassPrice() {
    if (declinePass.checked) {
        calcPassPrice = 0;
    } else if (addPass.checked) {
        calcPassPrice = 7.75;
    }
}

function getProtectionPrice() {

}




function isValidEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(checkoutEmail.value.trim());
    if (checkoutEmail.value.trim() !== "") {
        if (!isValid) {
        checkoutEmailMessage.textContent = "Please enter a valid email address";
        checkoutEmailMessage.className = "error";
        confirmEmail.style.pointerEvents = 'none';
        } else {
            confirmEmail.style.pointerEvents = 'auto';
            emailIsValid = true;
        }
  }
}

function checkEmailsMatch() {
    if (confirmEmail.value.trim() === "" || checkoutEmail.value.trim() === "") {
        checkoutEmailMessage.textContent = "";
        confirmEmailMessage.textContent = "";
    return;
    }
    if (checkoutEmail.value.trim() === confirmEmail.value.trim()) {
        checkoutEmailMessage.textContent = "✔";
        confirmEmailMessage.textContent = "✔";
        checkoutEmailMessage.className = "success";
        confirmEmailMessage.className = "success";  
        emailsMatch = true; 
    } else {
        checkoutEmailMessage.textContent = "✖ Emails do not match";
        confirmEmailMessage.textContent = "✖ Emails do not match";
        checkoutEmailMessage.className = "error";
        confirmEmailMessage.className = "error";
    }
}

function isValidPhone() {
    const letterRegex = /[a-z]/i;
    const isValid = letterRegex.test(phone.value.trim());

    if (isValid) {
        phoneMessage.textContent = "✖ Letters not accepted";
        phoneIsValid = false;
        phoneMessage.className = "error";
     
    } else {
        phoneMessage.textContent = "";
        phoneIsValid = true;
        alert('No letters!');
    }
}

function isValidZip() {
    const letterRegex = /[a-z]/i;
    const isValid = letterRegex.test(zip.value.trim());

    if (isValid) {
        zipMessage.textContent = "✖ Letters not accepted";
        zipIsValid = false;
        zipMessage.className = "error";
    } else {
        zipMessage.textContent = "";
        zipIsValid = true;
        alert('No letters!');
    }
}

function isValidCard() {
    const letterRegex = /[a-z]/i;
    const isValid = letterRegex.test(cardNumber.value.trim());

    if (isValid) {
        cardNumberMessage.textContent = "✖ Letters not accepted";
        cardIsValid = false;
        cardNumberMessage.className = "error";
    } else {
        cardNumberMessage.textContent = "";
        cardIsValid = true;
        alert('No letters!');
    }
}


function isValidCvv() {
    const letterRegex = /[a-z]/i;
    const isValid = letterRegex.test(cvv.value.trim());

    if (isValid) {
        cvvMessage.textContent = "✖ Letters not accepted";
        cvvIsValid = false;
        cvvMessage.className = "error";
    } else {
        cvvMessage.textContent = "";
        cvvIsValid = true;
        alert('No letters!');
    }
}


nextSlideButton.addEventListener('click', () => {
    // CHECK SLIDE 1
    if (currentSlide == 0) {
        const slide1inputs = document.querySelectorAll('.slide1input');
        let allFilled = true;

        for (const input of slide1inputs) {
            if (input.value.trim() === "") {
                allFilled = false;
                break; 
            }
        }

        if (allFilled && emailsMatch && emailIsValid && phoneIsValid) {
            alert('All inputs filled!');
            nextSlide();
        } else {
            alert('Missing input!');
        }
    }

    // CHECK SLIDE 2
     if (currentSlide == 1) {
        let allFilled = true;
        let selectsSelected = true;

        const slide2inputs = document.querySelectorAll('.slide2input');
        const slide2select = document.querySelectorAll('.slide2select');

        for (const select of slide2select) {
            if (select.value === "") {
                selectsSelected = false;
                break; 
            } 
        }

        for (const input of slide2inputs) {
            if (input.value.trim() === "") {
                allFilled = false;
                break; 
            }
        }
    
        if (allFilled && selectsSelected && zipIsValid && cardIsValid && cvvIsValid) {
            alert('All inputs filled!'); 
            nextSlide();
        } else {
            alert('Missing input!'); 
        }
    }

    // CHECK SLIDE 3
    if (currentSlide === 2) {
        alert('slide 3!');
    }
})

function enforceOneChecked(firstBox, secondBox) {
    if (firstBox.checked) {
      // If this one is checked, uncheck the other
      secondBox.checked = false;
    } else {
      // If this one is unchecked, check the other
      secondBox.checked = true;
    }
  }

  function getPassPrice() {
    if (declinePass.checked) {
        calcPassPrice = 0;
    } else if (addPass.checked) {
        calcPassPrice = 7.75;
    }

   // or do.. return calcPassPrice && see below
}

function getProtectionPrice() {
    if (declineProtection.checked) {
        calcProtectionPrice = 0;
    } else if (addProtection.checked) {
        calcProtectionPrice = 10.95 //* numberOfTickets;
    }

   // or do.. return calcProtectionPrice && see below
}



  function totalOrder() {
    numberOfTickets = ticketSelect.value;
    ticketPrice.textContent = "$" + pricePerTicket + " x " + numberOfTickets;
    const salesTaxAmount = (pricePerTicket * numberOfTickets) * salesTaxRate; 
    //Sales Tax Amount = Total Price x Sales Tax Rate.
    salesTax.textContent = "$" + salesTaxAmount;
 
    const calcTicketPrice = pricePerTicket * numberOfTickets;
   
    parkingPrice.textContent = "$" + calcPassPrice; // --->
    // OR "$" + getPassPrice()
    protectionPrice.textContent = "$" + calcProtectionPrice; // --->
    // OR "$" + getProtectionPrice() * numTickets //OR protectionPrice.textContent = "$" + getProtectionPrice + " x " + numberOfTickets 
    // calcProtectionPrice = getProtectionPrice * numberOfTickets
    totalOfAllPrices = calcTicketPrice + salesTaxAmount + calcPassPrice + calcProtectionPrice;
    orderTotal.textContent = "$" + totalOfAllPrices;
     
  }



 // when time is up... hide next/back buttons
 // fix next button skipping over every filled slide
 // fix checking which checkbox was checked
