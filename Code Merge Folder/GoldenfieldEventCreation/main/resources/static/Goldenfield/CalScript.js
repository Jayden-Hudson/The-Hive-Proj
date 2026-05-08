let selectedShow = null;
let selectedShowTime = null;
let selectedShowDate = null;
let selectedEvent = null;

const els = {
  daysList: document.getElementById('days'),
  monthYear: document.getElementById('month-year'),
  prevMonthBtn: document.getElementById('previous-month'),
  nextMonthBtn: document.getElementById('next-month'),
};

//for calendar
const daysList = els.daysList;
const monthYear = els.monthYear;
const prevMonthBtn = els.prevMonthBtn;
const nextMonthBtn = els.nextMonthBtn;

//stored fetched data from /api/events (all events)
let eventsCache = [];

//pads numbers used in dates to ensure two-digit format to fit iso format which works with calendar
function pad(n) { return n < 10 ? '0' + n : String(n); }

//creates date using current date provided by user's browser
let date = new Date();

document.addEventListener('DOMContentLoaded', () => {
  //initial load
  fetchEvents();
});

//get all events
async function fetchEvents() {
  try {
    const res = await fetch('http://localhost:8080/api/events');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    //put all event info into eventsCache array
    eventsCache = Array.isArray(data) ? data : [];

    try { renderCalendar(); } catch (e) {  }

  } catch (err) {
    console.error('Failed to fetch events', err);
  }
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatTimeTo12Hour(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return '';

    const parts = timeStr.split(':');
    if (parts.length < 2) return '';

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.
    return `${hours}:${minutes} ${ampm}`;
}

//render item on calendar with full (title, description, event time, venue id)
function renderItemFull(item) {
  const el = document.createElement('div');
  el.className = 'eventFull';

  //if event is cancelled
  if (item.eventcancelled === true) {
    el.classList.add('hiddenEvent');
  }

  // style purpose
  el.classList.add('dayBox');
  //create button for each item on calendar to redirect user to checkout page
  const viewShowButton = document.createElement('button');
  viewShowButton.classList.add("getTicketsBtn");

   //check item exists and has id
    const stableId = item && (item.eventid);
    if (stableId) el.dataset.id = stableId;

   //Set status/innerHTML of viewShowButton
   setEventSoldOut(item.eventid, viewShowButton);

    // Apply formatting before setting innerHTML
    const formattedTime = formatTimeTo12Hour(item.eventtime);

    let venueDisplay = "";
    if (item.venueid === 1) {
        venueDisplay = "Goldenfield"; //or  "Goldenfield Arena" ??
    } else if (item.venueid != null) {
        venueDisplay = item.venueid; // fallback to original value
    }

    el.innerHTML = `
        <strong>${item.title|| ""}</strong></br>
        ${venueDisplay}</br>
        ${formattedTime || ""}</br>
    `;

    //add event listener to each button to trigger page redirection
    viewShowButton.addEventListener('click', () => {
        viewSelectedShow(item.title, item.eventtime, item.eventdate, item.eventid);
    });

    el.appendChild(viewShowButton);

  return el;
}

async function setEventSoldOut(eventid, elm) {
    try {
        const response = await fetch(`/api/soldout/events/${eventid}`);
        const eventSoldOut = await response.json();

        console.log(eventid, eventSoldOut); //testing

        if (Boolean(eventSoldOut)) {
            elm.innerHTML = "SOLD OUT";
            elm.classList.add("soldOutBtn");
            elm.classList.remove("getTicketsBtn");
        } else {
            elm.innerHTML = "Get Tickets";
        }
    } catch (error) {
        console.error("Error fetching sold-out status:", error);
    }
}

//Pass details to selection/checkout page
function viewSelectedShow(show, time, date, id) {
    //set each value
    selectedShowTime = time;
    selectedShow = show;
    selectedShowDate = date;
    selectedEvent = id;
    //must encode to pass values
    let encodedShow = encodeURIComponent(show);
    let encodedTime = encodeURIComponent(time);
    let encodedDate = encodeURIComponent(date);
    let encodedEvent = encodeURIComponent(id);

    //redirects user to tix selection/checkout page
    window.location.href = `/Goldenfield/checkout.html?show=${encodedShow}&time=${encodedTime}&date=${encodedDate}&id=${encodedEvent}`;
}

function renderCalendar() {
    //daysList is all the day cells in calendar, clear it to prevent rendering duplicates
    daysList.innerHTML = '';

    //get current month and year provided by user's browser
    const month = date.getMonth();
    const year = date.getFullYear();

    //display current month and year on calendar
    monthYear.textContent = `${months[month]} ${year}`;

    //get first day and last date of the month
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    //render empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const beforeFirstday = document.createElement('div');
        beforeFirstday.classList.add('empty');
        daysList.appendChild(beforeFirstday);
    }

    //render all days in the month
    for (let day = 1; day <= lastDate; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendarDay';

    //display date number on day box
    const dayNumber = document.createElement('div');
    dayNumber.className = 'dayNumber';
    dayNumber.textContent = day.toString();
    cell.appendChild(dayNumber);

    //pad numbers used in dates to ensure two-digit format to fit iso format which works with calendar
    const iso = `${year}-${pad(month + 1)}-${pad(day)}`;

    //get all events for the day
    //create new array and filter for specific day
    const dayEvents = eventsCache.filter(event => {
            if (!event) return false;
            let d = event.eventdate;
            if (!d) return false;
            //make sure eventdate is a string
            if (typeof d !== 'string') d = String(d);
            //compare eventdate (without time) to iso to find matching events
            return d.split('T')[0] === iso;
          });


    //check if there are events for the day, then render them
    if (dayEvents.length > 0) {
      const container = document.createElement('div');
      container.className = 'dayEventsContainer';
      for (const event of dayEvents) {
        const full = renderItemFull(event);
        container.appendChild(full);
      }
      cell.appendChild(container);
    }
    daysList.appendChild(cell);
  }
}

//buttons to move to next/previous month
prevMonthBtn.addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

 /*
    //render event details
    //Molly...see above- simplified for the sake of space within each calendar day(the innerhtml), & reformatted some details
    el.innerHTML = `
        <strong>${item.title || ''}</strong>,
        ${item.eventtime || ''},
        ${item.venueid || ''}
    `; */

    //Hannah's original if wishing to revert
    /*el.innerHTML = `
        <strong>${item.title || ''}</strong><br>
        Description: ${item.description || ''}<br>
        Event Time: ${item.eventtime || ''}<br>
        Venue ID: ${item.venueid || ''}<br>
    `; */

/*
daysList.addEventListener('click', (e) => {
    if (e.target.classList.contains('empty')) return;
        const selected = daysList.querySelector('.selected');

    if (selected) selected.classList.remove('selected');
        e.target.classList.add('selected');

    const day = Number(e.target.textContent);
    date.setDate(day);
});
*/