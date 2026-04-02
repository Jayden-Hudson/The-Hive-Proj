    let ticketSelection = ticketSelect.value;
    const listings = document.getElementById('listings');
    let currentSection = null;

    ticketSelect.addEventListener('change', () => {
        ticketSelection = ticketSelect.value;
        if (currentSection !== null) {
            displayTickets(currentSection);
        }
    })

    const sectionConfig = {
        1: { rows: { 1: 10, 2: 10, 3: 10 } }, // Section 1: 3 rows, 10 seats each
        2: { rows: { 1: 8, 2: 8, 3: 8, 4: 8 } } // Section 2: 4 rows, 8 seats each
    };
    
    // Function to display tickets for a section
    function displayTickets(sectionNumber) {
       listings.innerHTML = ''; 
       currentSection = sectionNumber;
    
        const rows = sectionConfig[sectionNumber].rows;
        for (const row in rows) {
            const remainingTickets = rows[row];
            if (remainingTickets > 0) {
                const ticketSelection =  ticketSelect.value;//Math.min(remainingTickets, 4); // Example: max 4 tickets per selection
    
                const ticketBlock = document.createElement('div');
                ticketBlock.className = 'ticket-div';
                ticketBlock.textContent = `${ticketSelection} tickets - Section ${sectionNumber}, Row ${row} (${remainingTickets} left)`;
    
                const addToCart = document.createElement('button');
                addToCart.textContent = 'Add to cart';
    
                // Click event: subtract from the chosen row only
                addToCart.addEventListener('click', () => {
                    if (rows[row] >= ticketSelection) {
                        rows[row] -= ticketSelection; // Subtract from that row only
                        
                        //log section, row, and remaining tickets 
                        //rows[row] returns the number of tickets left in that row
                        console.log(
                            `Section ${currentSection}, Row ${row} — Remaining tickets: ${rows[row]}`
                        );
                        
                        displayTickets(sectionNumber); // Re-render
                    } else {
                        alert('Not enough tickets left in this row.');
                    }
                });
    
                ticketBlock.appendChild(addToCart);
                listings.appendChild(ticketBlock);
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



