//populate number of tickets available for an event by totalling all sections num of tickets
//add totaltickets to each event in event table,
    //AND ticketsleft for each event in event table, defualt val to totaltickets
    //AND soldout column for each event in event table,
    //AND @ checkout, subrtract numtickets bought from ticketsleft, set event to soldout when === 0
    // ----> once sold out, keep on calendar, set get tickets button to unclickable / text to 'SOLD OUT'
//add cancelled column for each event in event table
    // ----> if cancelled,  keep on calendar, set get tickets button to unclickable / text to 'CANCELLED' or remove completely

let ticketSelection = ticketSelect.value;
const listings = document.getElementById('listings');
let currentSection = null;
let cartItems = [];
let currentRow = null;

function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
}

function format12Hour(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return '';

    const parts = timeStr.split(':');
    if (parts.length < 2) return '';

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.
    return `${hours}:${minutes} ${ampm}`;
}

function formatDateWithSuffix(dateStr) {
    try {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            throw new Error("Invalid date format. Expected YYYY-MM-DD.");
        }

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date value.");
        }

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const day = date.getDate();
        const year = date.getFullYear();
        const monthName = months[date.getMonth()];

        //Get suffix
        const suffix = (day % 10 === 1 && day !== 11) ? "st" :
                       (day % 10 === 2 && day !== 12) ? "nd" :
                       (day % 10 === 3 && day !== 13) ? "rd" : "th";

        return `${monthName} ${day}${suffix}, ${year}`;
    } catch (err) {
        return `Error: ${err.message}`;
    }
}

//get the Query param values
window.onload = function() {
    const artistName = getQueryParam('show');
    const showTime = getQueryParam('time');
    const showDate = getQueryParam('date');
    const showId = getQueryParam('id');
    const safeId = showId !== null && !isNaN(showId) ? Number(showId) : null; //delete if unused

    getEventParking(safeId);

    for (let sectionId = 1; sectionId <= 8; sectionId++) {
        getSoldOutSections(sectionId);
    }

    if (artistName) {
        const updateTime = format12Hour(showTime);
        const updateDate = formatDateWithSuffix(showDate);
        displayShowInfo(artistName, updateTime, updateDate); // Replace with safeId <--- ???
    } else {
        console.long('unknown artist');
    }
};

//display show details from param values on checkout page
function displayShowInfo(artistName, showTime, showDate) {
    showPerformers.textContent = artistName;
    showDay.textContent = showDate;
    showHour.textContent = showTime;
}

ticketSelect.addEventListener('change', () => {
   ticketSelection = ticketSelect.value;
   if (currentSection != null) {
    loadSectionRows(currentSection)
   }
})

document.getElementById('section1').addEventListener('click', () => {
    loadSectionRows(1);
    currentSection = 1;
});

document.getElementById('section2').addEventListener('click', () => {
    loadSectionRows(2);
    currentSection = 2;
});

document.getElementById('section8').addEventListener('click', () => {
    loadSectionRows(8);
    currentSection = 8;
});

document.getElementById('section3').addEventListener('click', () => {
    loadSectionRows(3);
    currentSection = 3;
});

document.getElementById('section4').addEventListener('click', () => {
    loadSectionRows(4);
    currentSection = 4;
});

document.getElementById('section5').addEventListener('click', () => {
    loadSectionRows(5);
    currentSection = 5;
});

document.getElementById('section6').addEventListener('click', () => {
    loadSectionRows(6);
    currentSection = 6;
});

document.getElementById('section7').addEventListener('click', () => {
    loadSectionRows(7);
    currentSection = 7;
});

async function getEventParking(safeId) {
    if (safeId === null) {
        console.warn("Invalid or missing event ID in URL");
        return;
    }

    try {
        const addPassDiv = document.getElementById('addPassDiv');
        const declinePassDiv = document.getElementById('declinePassDiv');
        const parkingStatus = document.getElementById('parkingPara');

        const response = await fetch(`/api/eventparking/${safeId}`);
        if (!response.ok) throw new Error("Failed to fetch event parking data. Event may have been created before 'parkingbyevent' table configuration");

        const data = await response.json();
        if (!data) {
            console.warn("No parking data returned");
            return;
        }

        const checkSoldout = Boolean(data.soldoutEvent);
         if (checkSoldout) {
            parkingStatus.textContent = "SOLD OUT";
            declinePass.checked = true;
            addPassDiv.style.visibility = 'hidden';
            declinePassDiv.style.visibility = 'hidden';
        } else {
            addPassDiv.style.visibility = 'visible';
            declinePassDiv.style.visibility = 'visible';
        }
    } catch (err) {
        console.error(err);
        alert("Failed to fetch event parking data");
    }
}

async function loadSectionRows(section) {
    const showId = getQueryParam('id');
    const safeId = showId !== null && !isNaN(showId) ? Number(showId) : null;
    const sectionId = section;

    try {
        const response = await fetch(`/api/sections/${sectionId}/${safeId}`);
        if (!response.ok) throw new Error("Failed to fetch rows");

        const rows = await response.json();
        listings.innerHTML = '';

        if (rows.length === 0) {
            listings.innerHTML = "<p>SOLD OUT</p>";
            return;
        }
        else {
            rows.forEach(r => {
              const rowDiv = document.createElement('div');
              rowDiv.className = 'ticket-div';

              const safeRowNumber = String(r.rowsInSection);
              const safeSectionId = String(r.clickedSection);
              const safeTicketsLeft = String(r.ticketsInRow);
              const checkSoldOutRow = Boolean(r.soldOutRow);

              if (currentSection === 8) {
                 rowDiv.textContent = `${ticketSelection} Tickets - Section GA PIT  (${safeTicketsLeft} left!)`;
              }
              else {
                  rowDiv.textContent = `${ticketSelection} Tickets - Section ${safeSectionId} Row ${safeRowNumber}  (${safeTicketsLeft} left!)`;
              }

              const addToCart = document.createElement('button');
              addToCart.textContent = 'Add to cart';

              addToCart.addEventListener('click', () => {
                if (r.ticketsInRow > 0) {
                    openOverlay();
                    currentRow = Number(safeRowNumber);
                }
                else {
                    alert(`No tickets left for Row ${safeRowNumber}`);
                }
              });
                //Display tickets ONLY IF number of tickets selected is less than or equal to what is avaialbe in that row
               if (r.ticketsInRow >= ticketSelection) {
                  rowDiv.appendChild(addToCart);
                  listings.appendChild(rowDiv);
                }
                /// EITHER: dont display row if soldout... OR display greyed out
               /* if (r.soldOutRow === true) { //if(checkSoldOutRow)
                   rowDiv.textContent = `SOLD OUT - Section ${safeSectionId} Row ${safeRowNumber}`;
                   rowDiv.style.backgroundColor = "gray";
                   addToCart.style.visibility = "hidden";
               } */
            });
        }
    } catch (err) {
        console.error(err);
        document.getElementById("listings").innerHTML = "<p>Error loading rows.</p>";
    }
}

async function getSoldOutSections(sectionId) {
    const showId = getQueryParam('id');
    const safeId = showId !== null && !isNaN(showId) ? Number(showId) : null;

    if (safeId === null) {
        console.error("Invalid or missing event ID");
        return;
    }
    try {
        const response = await fetch(`/api/soldout/sections/${sectionId}/${safeId}`);
        const isSoldOut = await response.json();
        const sectionDiv = document.getElementById(`section${sectionId}`);
        if (isSoldOut) {
            sectionDiv.style.backgroundColor = "lightgray";
            sectionDiv.style.cursor = "default";
            sectionDiv.classList.add("soldOutSection");
        }/* else {
            sectionDiv.style.backgroundColor = "";
        } */
    } catch (error) {
        console.error("Error fetching sold-out status:", error);
    }
}


/*  -------------OLD CODE-------------------------------------------------------------
async function go(sectionid) {
        const showId = getQueryParam('id');
        const safeId = showId !== null && !isNaN(showId) ? Number(showId) : null;
        const sectionId = sectionid;
        try {
            // Fetch backend data
            const response = await fetch('http://localhost:8080/api/sections/${sectionId}/${safeId}');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            sectionRowsCache = Array.isArray(data) ? data : [];
            listings.innerHTML = '';
            //currentSection = sectionId;

            // Create new row divs
                const rowDiv = document.createElement('div');
                rowDiv.className = 'ticket-div';
                rowDiv.textContent = `Row ${safeId}: ${sectionId} seats`;
                const addToCart = document.createElement('button');
                addToCart.textContent = 'Add to cart';
                rowDiv.appendChild(addToCart);
                listings.appendChild(rowDiv);

        } catch (err) {
            console.error('Error fetching section data:', err);
        }
    }
    */

/*
const sectionConfig = {
    1: { rows: { 1: 10, 2: 11, 3: 12 } },
    2: { rows: { 1: 10, 2: 11, 3: 12 } },
    3: { rows: { 1: 12, 2: 13, 3: 14 } },
    4: { rows: { 1: 12, 2: 13, 3: 14 } },
    5: { rows: { 1: 21, 2: 21, 3: 23 } },
    6: { rows: { 1: 33, 2: 33, 3: 35 } },
    7: { rows: { 1: 21, 2: 21, 3: 23 } },
    8: { rows: { 1: 115 } }
}; */

/*
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
*/

/*
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
*/


/*
        //const numLeft = data.numPassesLeft;
        //const numSold = data.numPassesSold;
        if (numSold > 5) {
            parkingStatus.textContent = "SOLD OUT";
        } else {
            parkingStatus.textContent = numLeft + ' passes left';
        }
*/



