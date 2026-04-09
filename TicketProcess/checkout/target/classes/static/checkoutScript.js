//extra's (pop-up's, alerts, etc.)
const timer = document.getElementById('timer');
const popUp = document.getElementById('popUp');
const timesUpDiv = document.getElementById('timesUpDiv');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const timesUpOverlay = document.getElementById('timesUpOverlay');
const exitCartDiv = document.getElementById('exitCartDiv');
const missingFields = document.getElementById('missingFields'); //using???

//Validity messages
const checkoutEmailMessage = document.getElementById('checkoutEmailMessage');
const confirmEmailMessage = document.getElementById('confirmEmailMessage');
const phoneMessage = document.getElementById('phoneMessage');

const zipMessage = document.getElementById('zipMessage');
const cardNumberMessage = document.getElementById('cardNumberMessage');
const cvvMessage = document.getElementById('cvvMessage');
//map
const sections = document.querySelectorAll('.section');

//buttons
const buttonDiv = document.getElementById('buttonDiv'); //holds checkout buttons
const ticketsButton = document.getElementById('ticketsButton');
const nextSlideButton = document.getElementById('nextSlideButton');
const previousSlideButton = document.getElementById('previousSlideButton');
const placeOrderButton = document.getElementById('placeOrderButton');
const refreshButton = document.getElementById('refreshButton');
const stayInCart = document.getElementById('stayInCart');
const leaveCart = document.getElementById('leaveCart');

//ticket number select element
const ticketSelect = document.getElementById('ticketSelect');
let ticketNum = 0;  //initialze the number of tickets selected

//slides
const slideWrapper = document.querySelector('.slide-wrapper');
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const totalSlides = slides.length;

//unsure
const closeSlide = document.getElementById('closeSlide'); //using?
const ticketDiv = document.getElementById("ticketDiv"); //using?

//show details
const showPerformers = document.getElementById('showPerformers');
const showDateTime = document.getElementById('showDateTime');
const showAgesAllowed = document.getElementById('showDateTime');

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

closeSlide.addEventListener('click', () => {
    exitCartDiv.style.visibility = 'visible';
    
    stayInCart.addEventListener('click', () => {
        exitCartDiv.style.visibility = 'hidden';
    })

    leaveCart.addEventListener('click', () => {
        // HERE
        readdTickets();
        exitCartDiv.style.visibility = 'hidden';
        closeOverlay();
        //clear any ticket listings that were visible
        listings.innerHTML = '';
        currentSection = null;
        currentRow = null;
        startTimer();
    })
});


// open checkout
function openOverlay() {
    checkoutOverlay.style.display = 'flex'; // Use flex to center the modal-box
    nextSlideButton.classList.remove('hide');
    buttonDiv.style.visibility = 'visible';
    nextButtonOverlay.style.visibility = 'visible';
    resetSlide(); 
}


//close checkout
function closeOverlay() {
    checkoutOverlay.style.display = 'none';
    buttonDiv.style.visibility = 'hidden';
    hide();

    //move to a "reset checkout" function///////////////////////////////
    const slide1inputs = document.querySelectorAll('.slide1input');
    for (const input of slide1inputs) {
        input.value = "";
    }

    //clear al slide inputs
    checkoutEmailMessage.textContent = "";
    confirmEmailMessage.textContent = "";
    phoneMessage.textContent = "";

    const slide2inputs = document.querySelectorAll('.slide2input');
    const slide2select = document.querySelectorAll('.slide2select');

    for (const select of slide2select) {
        select.value = "";
        } 

    for (const input of slide2inputs) {
        input.value = "";
    }

    zipMessage.textContent = "";
    cardNumberMessage.textContent = "";
    cvvMessage.textContent = "";

    //reset total
    ticketSelect.value = 1;
    declineProtection.checked = true;
    declinePass.checked = true;

    enforceOneChecked(declinePass, addPass);
    enforceOneChecked(declineProtection, addProtection)

    getProtectionPrice(); //triggers total order
    getPassPrice(); //triggers total order
    //move to a "reset checkout" function///////////////////////////////
}

//hide checkout 'next' & 'back' buttons
function hide() {
    nextSlideButton.classList.add('hide');
    previousSlideButton.classList.add('hide');
    nextButtonOverlay.style.visibility = 'hidden';
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
});

//move to next checkout slide
function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlidePosition();

    if (currentSlide === 2) {
        nextButtonOverlay.style.visibility = 'hidden';
    } else {
        nextButtonOverlay.style.visibility = 'visible';
    }
  }
}

//go back to previous chekout slide
function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlidePosition();
  }

 if (currentSlide != 2) {
    nextButtonOverlay.style.visibility = 'visible';
 } else {
    nextButtonOverlay.style.visibility = 'hidden';
 }
}

function updateSlidePosition() {
  // Calculate the percentage to translate (0% for slide 1, -100% for slide 2, -200% for slide 3)
  const translateValue = -currentSlide * 100 / totalSlides;
  slideWrapper.style.transform = `translateX(${translateValue}%)`;
  
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

//display pop-up as user hovers over sections
sections.forEach(section => {
    section.addEventListener('mouseenter', () => {
        popUp.textContent = `Section: ${section.textContent}`;
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

//When cart timer reaches 0, display div to force user to refresh page
function refreshCart() {
    if (exitCartDiv.style.visibility === 'visible') {
        exitCartDiv.style.visibility = 'hidden';
    }
    timesUpOverlay.style.display = 'flex';
}

//close overlay and 'reset'
refreshButton.addEventListener('click', () => {
    //reaad unordred tickets to section/row inventory
    readdTickets();
    //clear previous ticket quantity search by section
    listings.innerHTML = '';
    //reset previously selected section/row to null 
    currentSection = null;
    currentRow = null;
    //close the cart (overlay)
    closeOverlay();
    //hide the refresh cart overlay
    timesUpOverlay.style.display = 'none';
    //restart the page timer for new ticket search
    startTimer();
})
///////////////////////////////////////////////////////////////////////////////////////

//start timer as soon as user is directed to checkout.html page
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

//generate a unique order confirmation number when user successfully places an order
function generateConfirmationNumber() {
    const now = new Date();
    //format date and time as YYYYMMDD-HHMMSS
    const datePart = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');

    const timePart = String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');

    //random 4-digit number to ensure uniqueness
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    //return confirmation number
    return `${datePart}-${timePart}-${randomPart}`;
}

//generate order date when user successfully places an order
function getFormattedDate(date = new Date()) {
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error("Invalid Date object provided.");
    }

    let day = String(date.getDate()).padStart(2, '0');       
    let month = String(date.getMonth() + 1).padStart(2, '0'); 
    let year = date.getFullYear();                           

    return `${day}/${month}/${year}`;
}


hide();
//start timer for browsig tickets
//window.onload = startTimer;
document.addEventListener('DOMContentLoaded', startTimer());



    



