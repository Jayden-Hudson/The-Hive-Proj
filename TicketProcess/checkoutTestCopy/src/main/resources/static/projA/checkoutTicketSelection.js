let ticketSelection = ticketSelect.value;
const listings = document.getElementById('listings');
let currentSection = null;
let cartItems = [];
let currentRow = null;

//GET NAME OF ARTIST BEING VIEWED
function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
}

window.onload = function() {
    const artistName = getQueryParam('show');
    const showTime = getQueryParam('time');
    const showDate = getQueryParam('date');
    if (artistName) {
    console.log(artistName, showTime, showDate);
    displayShowInfo(artistName, showTime, showDate);
        //document.getElementById('artistName').textContent = decodeURIComponent(artistName);
        // Here you could fetch ticket data from your database using artistName
    } else {
    console.long('unknown artist');
        //document.getElementById('artistName').textContent = "Unknown Artist";
    }
};


function displayShowInfo(artistName, showTime, showDate) {
   // const showPerformers = document.getElementById('showPerformers');
   // const showDateTime = document.getElementById('showDateTime');
  //  const showAgesAllowed = document.getElementById('showDateTime');
    showPerformers.textContent = artistName;
    showDay.textContent = showDate;
    showHour.textContent = showTime;

}

ticketSelect.addEventListener('change', () => {
    ticketSelection = ticketSelect.value;
    if (currentSection !== null) {
        displayTickets(currentSection);
    }
})

const sectionConfig = {
    1: { rows: { 1: 10, 2: 11, 3: 12 } }, 
    2: { rows: { 1: 10, 2: 11, 3: 12 } },
    3: { rows: { 1: 12, 2: 13, 3: 14 } },
    4: { rows: { 1: 12, 2: 13, 3: 14 } },
    5: { rows: { 1: 21, 2: 21, 3: 23 } },
    6: { rows: { 1: 33, 2: 33, 3: 35 } },
    7: { rows: { 1: 21, 2: 21, 3: 23 } },
    8: { rows: { 1: 115 } }
};

// Function to display tickets for a section
function displayTickets(sectionNumber) {
    listings.innerHTML = '';
    currentSection = sectionNumber;
    const rows = sectionConfig[sectionNumber].rows;
    
    for (const row in rows) {
        const remainingTickets = rows[row];

        if (remainingTickets > 0) {
            const ticketSelection =  ticketSelect.value;
            const ticketBlock = document.createElement('div');

            ticketBlock.className = 'ticket-div';
            if (currentSection === 8) 
                {
                    ticketBlock.textContent = `${ticketSelection} tickets - Section GA PIT, Row ${row} (${remainingTickets} left)`;
                } else {
                    ticketBlock.textContent = `${ticketSelection} tickets - Section ${sectionNumber}, Row ${row} (${remainingTickets} left)`;
                }

            const addToCart = document.createElement('button');
            addToCart.textContent = 'Add to cart';
                ticketBlock.appendChild(addToCart);
                listings.appendChild(ticketBlock);

            // Click event: subtract from the chosen row only
            addToCart.addEventListener('click', () => {
                if (rows[row] >= ticketSelection) {
                    rows[row] -= ticketSelection; // Subtract from that row only
                    console.log(rows[row]);

                    currentRow = row;
                    openOverlay();
                    //log section, row, and remaining tickets
                    //rows[row] returns the number of tickets left in that row

                    //HERE -> //SEE main checkoutScript line 78
                    cartItems.push({
                        section: sectionNumber,
                        row: row,
                        quantity: ticketSelection
                    }); // <-

                    console.log(cartItems); // testing
                    console.log(
                        `Section ${currentSection}, Row ${row} — Remaining tickets: ${rows[row]}`
                    );

                    
                    displayTickets(sectionNumber); //render again

                } else {

                    alert('Not enough tickets left in this row.');
                }
            });
        }
    }
}

//called in 'leaveCart'/'closeSlide' event listeners
//call in times up/refreshCart();
function readdTickets() {

    if (cartItems.length < 1) {
        return;
    }
    cartItems.forEach(item => {
        // Ensure section and row exist in sectionConfig
        const sectionKey = item.section;
        const rowKey = item.row;

        if (sectionConfig[sectionKey] && sectionConfig[sectionKey].rows[rowKey] !== undefined) {
            //prevent concatenation 
            sectionConfig[sectionKey].rows[rowKey] =
            Number(sectionConfig[sectionKey].rows[rowKey]) + Number(item.quantity);

            console.log(`Returned ${item.quantity} tickets to Section ${sectionKey}, Row ${rowKey}` );
        } else {
            console.warn(
                `Invalid section/row in cart item:`,
                item
            );
        }
    });
    
    // Clear the cart
    cartItems = [];
    console.log(cartItems);

    //Re-render tickets if applicable
    if (typeof currentSection !== "undefined") {
        displayTickets(currentSection);
    } 

    console.log("Cart closed, tickets returned to inventory.");
}

    /*
    function readdTickets() {
        // Loop through all items in the cart and return them to the original rows
        cartItems.forEach(item => {
            sectionConfig[item.section].rows[item.row] += item.quantity;
        });
    
        // Clear the cart
        cartItems = [];
        
        // Re-render the tickets view to show updated quantities
        if (typeof currentSection !== 'undefined') {
            displayTickets(currentSection);
        }
        console.log('Cart closed, tickets returned to inventory.');
    } */



    document.getElementById('section1').addEventListener('click', () => {

        currentSection = 1;

        displayTickets(1);

    });



    document.getElementById('section2').addEventListener('click', () => {

        currentSection = 2;

        displayTickets(2);

    });



    document.getElementById('section8').addEventListener('click', () => {

        currentSection = 8;

        displayTickets(8);

    });



    document.getElementById('section3').addEventListener('click', () => {

        currentSection = 3;

        displayTickets(3);

    });



    document.getElementById('section4').addEventListener('click', () => {

        currentSection = 4;

        displayTickets(4);

    });



    document.getElementById('section5').addEventListener('click', () => {

        currentSection = 5;

        displayTickets(5);

    });



    document.getElementById('section6').addEventListener('click', () => {

        currentSection = 6;

        displayTickets(6);

    });



    document.getElementById('section7').addEventListener('click', () => {

        currentSection = 7;

        displayTickets(7);

    });




    /*

    const ticketsPerRow = 10;

    onst rowsPerSection = 3;

    */

    /*

    const sectionConfig = {

        1: { rows: 3, seatsPerRow: 10 },

        2: { rows: 4, seatsPerRow: 8 },

        'GA PIT': { rows: 1, seatsPerRow: 20 },

        3: { rows: 6, seatsPerRow: 12 },

        4: { rows: 4, seatsPerRow: 12 },

        5: { rows: 7, seatsPerRow: 10 },

        6: { rows: 3, seatsPerRow: 12 },

        7: { rows: 2, seatsPerRow: 12 }

    };

    */

    /*

    const sectionConfig = {

        1: { rowSeats: [10, 10, 10] }, // Row 1, 2, 3 each have 10 seats

        2: { rowSeats: [8, 8, 8, 8] },

        'GA PIT': { rowSeats: [20] }

    }; */

    /* current ??

    function displayTickets(sectionNumber) {

        // Validate section exists

        if (!sectionConfig[sectionNumber]) {

            listings.innerHTML = `<p>Invalid section: ${sectionNumber}</p>`;

            return;

        }

        const { rows, seatsPerRow } = sectionConfig[sectionNumber];

        listings.innerHTML = ''; // Clear previous output

        for (let row = 1; row <= rows; row++) {

            let remainingTickets = seatsPerRow;



            // Create ticket blocks until fewer than ticketSelection remain

            while (remainingTickets >= ticketSelection) {

                const ticket = document.createElement('div');

                const addToCart = document.createElement('button');

                ticket.className = 'ticket-div';

                ticket.textContent = `${ticketSelection} tickets - Section ${sectionNumber}, Row ${row}`;

                listings.appendChild(ticket);

                addToCart.textContent = 'Add to cart';

                ticket.appendChild(addToCart);

                remainingTickets -= ticketSelection;

            }

        }

        currentSection = sectionNumber; // Remember last section

    }

    */