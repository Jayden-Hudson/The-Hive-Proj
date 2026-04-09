placeOrderButton.addEventListener('click', () => {

    if (slideOneValid && slideTwoValid) {
    
    let confirmationNum = generateConfirmationNumber();
    let orderDate = getFormattedDate();

    //dont need confirm email   
    //see buyer for slide one, see cardinfo for slide two
        const checkoutData = {
            email: checkoutEmail.value,
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
            confirmationNumber: confirmationNum,
            ticketPrice: calcTicketPrice,
            salesTax: salesTaxAmount,
            passPrice: calcPassPrice,
            protectionPrice: calcProtectionPrice,
            orderTotal: totalOfAllPrices,
            orderDate: orderDate,
            section: currentSection,
            row: currentRow,
            tickets: ticketSelect.value
        }
        
        console.log(checkoutData);

        
        //Send data
        fetch('http://localhost:8080/api/checkout', {  //Replace these :8080/as/needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkoutData),
        }).then(response => response.text())
                .then(data => alert(data))
                .catch(error => console.error('Error:', error));  

    }   
    
    //then...resetCart

})
   

