(function() {

    const ticketsPerRow = 10;
    const rowsPerSection = 3;
    let ticketSelection = ticketSelect.value;
    const listings = document.getElementById('listings');
    let currentSection = null;

    ticketSelect.addEventListener('change', () => {
        ticketSelection = ticketSelect.value;
        //added..
        if (currentSection !== null) {
            displayTickets(currentSection);
        }
    })

    function displayTickets(sectionNumber) {
        // Clear previous output
        listings.innerHTML = '';

        for (let row = 1; row <= rowsPerSection; row++) {
            let remainingTickets = ticketsPerRow;

            // Keep subtracting ticketSelection until fewer remain
            while (remainingTickets >= ticketSelection) {
                const ticket = document.createElement('div');
                ticket.className = 'ticket-div';
                ticket.textContent = `${ticketSelection} tickets - Section ${sectionNumber}, Row ${row}`;
                listings.appendChild(ticket);
                remainingTickets -= ticketSelection;
            }
        }
    }

    document.getElementById('section1').addEventListener('click', () => {
        currentSection = 1;
        displayTickets(1);
    });

    document.getElementById('section2').addEventListener('click', () => {
        currentSection = 2;
        displayTickets(2);
    });

    /*

    document.getElementById('section1').addEventListener('click', () => displayTickets(1));

    document.getElementById('section2').addEventListener('click', () => displayTickets(2));

    */



})();




/* brainstorm
const ga = document.getElementById('sectionGA');
const a1 = document.getElementById('sectionA1');
const a2 = document.getElementById('sectionA2');
const b1= document.getElementById('sectionB1');
const b2= document.getElementById('sectionB2');
const c1 = document.getElementById('sectionC1');
const c2 = document.getElementById('sectionC2');
const d1 = document.getElementById('sectionD1');
const sections = document.querySelectorAll('.section');
*/



