//calendar elements
const daysList = document.getElementById('days');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('previous-month');
const nextMonthBtn = document.getElementById('next-month');
const createForm = document.getElementById('createForm');
const updateForm = document.getElementById('updateForm');

//element references
const els = {
  list: document.getElementById('eventList'),
  refresh: document.getElementById('refreshBtn'),
  form: document.getElementById('createForm'),
  msg: document.getElementById('msg'),
  title: document.getElementById('title'),
  description: document.getElementById('description'),
  eventdate: document.getElementById('eventdate'),
  eventtime: document.getElementById('eventtime'),
  venueid: document.getElementById('venueid'),
  updateForm: document.getElementById('updateForm'),
  updatedEventID: document.getElementById('updatedEventID'),
  currentTitle: document.getElementById('currentTitle'),
  updatedTitle: document.getElementById('updatedTitle'),
  updatedDescription: document.getElementById('updatedDescription'),
  updatedEventDate: document.getElementById('updatedEventDate'),
  updatedEventTime: document.getElementById('updatedEventTime'),
  updatedVenueID: document.getElementById('updatedVenueID'),
  deleteForm: document.getElementById('deleteForm'),
  deletedTitle: document.getElementById('deletedTitle'),
  deletedEventID: document.getElementById('deletedEventID')
};

//stored fetched data from /api/events (all events)
let eventsCache = [];

//pads numbers used in dates to ensure two-digit format to fit iso format which works with calendar
function pad(n) { return n < 10 ? '0' + n : String(n); }

document.addEventListener('DOMContentLoaded', () => {
  els.msg = els.msg || document.getElementById('msg');
  els.form = els.form || document.getElementById('createForm');
  els.refresh = els.refresh || document.getElementById('refreshBtn');

  // Wire refresh button to reload events
  if (els.refresh) {
    els.refresh.addEventListener('click', () => fetchEvents());
  }

  // initial events fetch
  fetchEvents();

});

// Fetch events from database to show on list + calendar
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

//submit form
createForm.addEventListener('submit', function (event) {
  event.preventDefault(); //Prevent default form submission

  // Gather event data from form fields
  const eventData = {
    title: els.title.value,
    description: els.description.value,
    eventdate: els.eventdate.value,
    eventtime: els.eventtime.value,
    venueid: els.venueid.value
  }

  console.log(eventData);

  //Send event data
  fetch('http://localhost:8080/api/ECreation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  }).then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});

//update existing event
updateForm.addEventListener('submit', function (event) {
  event.preventDefault(); //Prevent default form submission

  // Gather event data from form fields
  const eventData = {
    title: els.updatedTitle.value,
    description: els.updatedDescription.value,
    eventdate: els.updatedEventDate.value,
    eventtime: els.updatedEventTime.value,
    venueid: els.updatedVenueID.value
  }

  console.log(eventData);

  const currentTitle = els.currentTitle.value.trim();

  if (!currentTitle) {
    showMessage('You must select an event and provide a title', true);
    return;
  }
  //look for a matching event
  const matches = eventsCache.filter(
    ev => String(ev.title).trim() === currentTitle
  );
  if (matches.length === 0) {
    alert(`No event found with name "${currentTitle}"`);
    return;
  }

  //get event id from database
  // it always uses the first match if there are multiple events with the same title
  let id = matches[0].eventid;

  //Send event data
  fetch(`http://localhost:8080/api/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  }).then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});


//validate event data
function validateEvent(obj) {
  const errors = [];
  const title = (obj.title || '').trim();
  if (title && !/^.{1,}$/.test(title)) {
    errors.push('title must be a string with at least 1 character');
  }

  const description = (obj.description || '').trim();
  if (description && !/^.{1,}$/.test(description)) {
    errors.push('description must be a string with at least 1 character');
  }

  const date = (obj.eventdate || '').trim();
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push('eventdate must be YYYY-MM-DD');
  }

  const time = (obj.eventtime || '').trim();
  if (time && !/^\d{1,2}[:]{1}\d{2}$/.test(time)) {
    errors.push('eventtime must be HH:MM');
  }

  const venueid = (obj.venueid || '');
  if (venueid && isNaN(Number(venueid))) {
    errors.push('venueid must be numeric');
  }

  return { valid: errors.length === 0, errors };
}

//show message to user
function showMessage(text, isError = false) {

  //check if there is already a message or not
  //find existing message element or create one
  if (!els.msg) {
    const found = document.getElementById('msg');
    if (found) els.msg = found;
    else {
      const message = document.createElement('div');
      message.id = 'msg';
      message.className = 'msg';
      //put the message at the top of the page
      document.body.prepend(message);
      els.msg = message;
    }
  }

  //set message text and set class depending on whether it's an error message or not
  els.msg.textContent = text;
  els.msg.className = isError ? 'msg error' : 'msg';
}

// Render items as list
function renderItem(item) {
  const li = document.createElement('li');
  li.classList.add("individualItem");
  const title = `${item.title} --`;
  const description = ` Description: ${item.description},`;
  const eventdate = ` Event Date: ${item.eventdate},`;
  const eventtime = ` Event Time: ${item.eventtime},`;
  const venueid = ` Venue ID: ${item.venueid}`;
  li.textContent = `${title}${description}${eventdate}${eventtime}${venueid}`;

  return li;
}

//creates date using current date provided by user's browser
let date = new Date();

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

//render item on calendar with title only
function renderItemSmall(item) {
  const el = document.createElement('div');
  el.className = 'eventSmall';
  el.textContent = item.title || '';
  return el;
}

//show events for a specific day on a list
function showEventsForDay(isoDate, events) {
  //clear list to prevent duplicates
  els.list.innerHTML = '';

  //create list and show which day
  const header = document.createElement('li');
  header.textContent = `Events for ${isoDate}`;
  els.list.appendChild(header);

  //show message if no events found
  if (!events || events.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No events that day.';
    els.list.appendChild(li);
    return;
  }

  //render each event
  for (const event of events) {
    els.list.appendChild(renderItem(event));
  }
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
        const small = renderItemSmall(event);
        container.appendChild(small);
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

//lets user click on event
daysList.addEventListener('click', (e) => {
  const eventEl = e.target.closest('.eventSmall');

  if (!eventEl || !daysList.contains(eventEl)) return;

  const selected = daysList.querySelector('.selected');
  if (selected) selected.classList.remove('selected');

  eventEl.classList.add('selected');

});
