const els = {
  daysList: document.getElementById('days'),
  monthYear: document.getElementById('month-year'),
  prevMonthBtn: document.getElementById('previous-month'),
  nextMonthBtn: document.getElementById('next-month'),
  list: document.getElementById('eventList'),
};

//popup for clicking event on calendar
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');
const modalActions = document.getElementById('modalActions');

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
  // initial load
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

    //checks if there is list (currently on eventCreation page only)
    if (els.list) {

      //clears list to prevent duplicate items
      els.list.innerHTML = '';

      //if no items, display message instead of empty list
      if (eventsCache.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No events.';
        els.list.appendChild(li);
      }

      else {
        //render each event
        for (const ev of eventsCache) {
          els.list.appendChild(renderItem(ev));
        }
      }
    }

    try { renderCalendar(); } catch (e) { }

  } catch (err) {
    console.error('Failed to fetch events', err);
  }
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

//render item on calendar with full (title, description, event time, venue id)
function renderItemFull(item) {
  const el = document.createElement('div');
  el.className = 'eventFull';

  //check item exists and has id
  const stableId = item && (item.eventid);

  if (stableId) el.dataset.id = stableId;
  //render event details
  el.innerHTML = `
    <strong>${item.title || ''}</strong><br>
    Description: ${item.description || ''}<br>
    Event Time: ${item.eventtime || ''}<br>
    Venue ID: ${item.venueid || ''}<br>
  `;

  return el;
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

//lets user click on event to view details
daysList.addEventListener('click', (e) => {
  const eventEl = e.target.closest('.eventFull');
  if (!eventEl || !daysList.contains(eventEl)) return;

  const eventId = eventEl.dataset.id;

  //open popup showing data for event clicked on
  openEventModal(eventId);
});

//function to open modal and display event details
function openEventModal(id) {
  if (!modal) return;

  //find event in cache
  const event = eventsCache.find(e => (e.eventid && e.eventid == id));
  if (!event) return;

  //populate modal with event details
  if (modalBody) {
    modalBody.innerHTML = `
      <h2>${event.title}</h2>
      <p><strong>Description:</strong> ${event.description || 'N/A'}</p>
      <p><strong>Date:</strong> ${event.eventdate || event.eventDate || ''}</p>
      <p><strong>Time:</strong> ${event.eventtime || event.eventTime || ''}</p>
      <p><strong>Venue:</strong> ${event.venueid || event.venueId || ''}</p>
    `;

    //create button to open event page
    modalActions.innerHTML = `<button id="openPageBtn">Open Page</button>`;

    //show modal
    modal.classList.remove('hidden');

    //open event page on button click
    document.getElementById('openPageBtn').onclick = () => {
      const openId = event.eventid;
      if (!openId) {
        console.error('No id available for event', event);
        return;
      }
      //redirect to event page
      window.location.href = `/EPage.html?id=${(openId)}`;
    };
  };
}

//close modal button
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    if (modal) modal.classList.add('hidden');
  });
}

//closes modal if user clicks outside of it
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}