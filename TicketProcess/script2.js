//extra's (pop-up's, alerts, etc.)
const timer = document.getElementById('timer');
const popUp = document.getElementById('popUp');
const timesUpDiv = document.getElementById('timesUpDiv');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const timesUpOverlay = document.getElementById('timesUpOverlay');

//Validity messages
const checkoutEmailMessage = document.getElementById('checkoutEmailMessage');
const confirmEmailMessage = document.getElementById('confirmEmailMessage');
const phoneMessage = document.getElementById('phoneMessage');

const zipMessage = document.getElementById('zipMessage');
const cardNumberMessage = document.getElementById('cardNumberMessage');
const cvvMessage = document.getElementById('cvvMessage');
//stage
const sections = document.querySelectorAll('.section');

//buttons
const buttonDiv = document.getElementById('buttonDiv'); //holds checkout buttons
const ticketsButton = document.getElementById('ticketsButton');
const nextSlideButton = document.getElementById('nextSlideButton');
const previousSlideButton = document.getElementById('previousSlideButton');
const placeOrderButton = document.getElementById('placeOrderButton');
const refreshButton = document.getElementById('refreshButton');

//ticket number select element
const ticketSelect = document.getElementById('ticketSelect');
const ticketNum = 0;  //initialze the number of tickets selected

//slides
const slideWrapper = document.querySelector('.slide-wrapper');
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const totalSlides = slides.length;

//unsure
const closeSlide = document.getElementById('closeSlide'); //using?
const ticketDiv = document.getElementById("ticketDiv"); //using?

//CHECKOUT
const checkoutEmail = document.getElementById('checkoutEmail');
const confirmEmail = document.getElementById('confirmEmail');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const phone = document.getElementById('phone');
const address = document.getElementById('address');
const city = document.getElementById('city');
const state = document.getElementById('state');
const zip = document.getElementById('zip');
const cardNumber = document.getElementById('cardNumber');
const expirationMonth = document.getElementById('expirationMonth');
const expirationYear = document.getElementById('expirationYear')
const cvv = document.getElementById('cvv');
const addPass = document.getElementById('addPass');
const declinePass = document.getElementById('declinePass');
const addProtection = document.getElementById('addProtection');
const declineProtection = document.getElementById('declineProtection');
const ticketPrice = document.getElementById('ticketPrice');
const salesTax = document.getElementById('salesTax');
const parkingPrice = document.getElementById('parkingPrice');
const protectionPrice = document.getElementById('protectionPrice');
const orderTotal = document.getElementById('orderTotal');

/*
placeOrderButton.addEventListener('click', () =>{
    const checkoutData = {
        checkoutEmail: checkoutEmail.value,
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
        orderTotal: orderTotal.value
    }
}) */



// open checkout
function openOverlay() {
    checkoutOverlay.style.display = 'flex'; // Use flex to center the modal-box
    nextSlideButton.classList.remove('hide');
    buttonDiv.style.visibility = 'visible';
    resetSlide(); 
}


//close checkout
function closeOverlay() {
    checkoutOverlay.style.display = 'none';
    buttonDiv.style.visibility = 'hidden';
    hide();
}

//hide checkout 'next' & 'back' buttons
function hide() {
    nextSlideButton.classList.add('hide');
    previousSlideButton.classList.add('hide');
}


//reset slide to first slide if users exits the checkout(abandoning cart)
function resetSlide() {
    currentSlide = 0;
    updateSlidePosition();
}

//to be removed once selecting a ticket is implemented
ticketsButton.addEventListener('click', openOverlay);

ticketSelect.addEventListener('change', () => {
   ticketNum = ticketSelect.value;
    alert(ticketNum);
});

//move to next checkout page
function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlidePosition();
  }

}

//go back to previous chekout page
function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlidePosition();
  }
}

function updateSlidePosition() {
  // Calculate the percentage to translate (0% for slide 1, -100% for slide 2, -200% for slide 3)
  const translateValue = -currentSlide * 100 / totalSlides;
  slideWrapper.style.transform = `translateX(${translateValue}%)`;
  
      // otherwise show it.
    if (currentSlide >= 2 ) {
        nextSlideButton.classList.add('hide');
    } else {
        nextSlideButton.classList.remove('hide');
    } 

    if (currentSlide >= 1) {
        previousSlideButton.classList.remove('hide');
    } else {
        previousSlideButton.classList.add('hide');
    } 
} 

//test removing later - initial position (optional, as currentSlide is 0 by default)
updateSlidePosition(); 

// Hover above MOUSE
sections.forEach(section => {
    section.addEventListener('mouseenter', () => {
        popUp.textContent = `Section: ${section.textContent}`;
        // Text content to be... descriptive of listing/pricing, etc.. 
        // SEE FOR EXAMPLE
        // https://gotickets.com/tickets/1221767/cardi-b-tickets/target-center-minneapolis-mn-3-12-2026?orderBy=Price%3A+Low+to+High&quantity=2
        popUp.style.opacity = '1';
    });
    
    section.addEventListener('mousemove', (e) => {
        const offsetX = 0;  
        const offsetY = 12;  
        popUp.style.left = `${e.pageX + offsetX - popUp.offsetWidth / 2}px`;
        popUp.style.top = `${e.pageY - popUp.offsetHeight - offsetY}px`;
    });

    section.addEventListener('mouseleave', () => {
        popUp.style.opacity = '0';
    });
});


//display overlay when time is up
function refreshCart() {
    timesUpOverlay.style.display = 'flex';
    //TODO: logic to reset values to ... 0 in cart here or ... below
}

//close overlay and 'reset'
refreshButton.addEventListener('click', () => {
    timesUpOverlay.style.display = 'none';
})
///////////////////////////////////////////////////////////////////////////////////////

// Timer to be triggered by... a....'continue' button that leads to the map display
function startTimer() {
    let time = 10 * 60;

    function decrementTime() {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const formatTime = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        timer.textContent = 'Cart Expires in ' + formatTime; 
        
        if (time <= 0) {
            clearInterval(interval);
            timer.textContent = '00:00';
            refreshCart();
        }
        time--;
     }
     decrementTime();
     const interval = this.setInterval(decrementTime, 1000);
}

//ensure checkout buttons are hidden on page load/script begins
hide();
//start timer for browsig tickets
//window.onload = startTimer;
document.addEventListener('DOMContentLoaded', startTimer());



    

/*
const ga = document.getElementById('sectionGA');
const a1 = document.getElementById('sectionA1');
const a2 = document.getElementById('sectionA2');
const b1= document.getElementById('sectionB1');
const b2= document.getElementById('sectionB2');
const c1 = document.getElementById('sectionC1');
const c2 = document.getElementById('sectionC2');
const d1 = document.getElementById('sectionD1');
const sections = document.querySelectorAll('.section');
// TODO: If a section is sold out, color that section differently, like gray
*/

