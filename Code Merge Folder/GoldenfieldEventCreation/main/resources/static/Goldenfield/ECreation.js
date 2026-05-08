//calendar elements
const daysList = document.getElementById('days');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('previous-month');
const nextMonthBtn = document.getElementById('next-month');

//element references
const els = {
  eventList: document.getElementById('eventList'),
  requestList: document.getElementById('requestList'),
  refreshEvents: document.getElementById('refreshEvents'),
  refreshRequests: document.getElementById('refreshRequests'),
  createForm: document.getElementById('createForm'),
  msg: document.getElementById('msg'),
  title: document.getElementById('title'),
  description: document.getElementById('description'),
  eventdate: document.getElementById('eventdate'),
  eventtime: document.getElementById('eventtime'),
  venueid: document.getElementById('venueid'),
  updateForm: document.getElementById('updateForm'),
  updatedEventID: document.getElementById('updatedEventID'),
  updatedTitle: document.getElementById('updatedTitle'),
  updatedDescription: document.getElementById('updatedDescription'),
  updatedEventDate: document.getElementById('updatedEventDate'),
  updatedEventTime: document.getElementById('updatedEventTime'),
  updatedVenueID: document.getElementById('updatedVenueID'),
  cancelForm: document.getElementById('cancelForm'),
  cancelledTitle: document.getElementById('cancelledTitle'),
  cancelledEventID: document.getElementById('cancelledEventID'),
};

//stored fetched data from /api/events (all events)
let eventsCache = [];
//stored fetched data from /api/eventrequests (all event requests)
let eventRequestsCache = [];

//pads numbers used in dates to ensure two-digit format to fit iso format which works with calendar
function pad(n) { return n < 10 ? '0' + n : String(n); }

document.addEventListener('DOMContentLoaded', () => {
  els.msg = els.msg || document.getElementById('msg');
  els.refreshEvents = els.refreshEvents || document.getElementById('refreshEvents');
  els.refreshRequests = els.refreshRequests || document.getElementById('refreshRequests');

  // Wire refresh button to reload events
  if (els.refreshEvents) {
    els.refreshEvents.addEventListener('click', () => fetchEvents());

  }

  if (els.refreshRequests) {
    els.refreshRequests.addEventListener('click', () => fetchEventRequests());
  }

  // initial events fetch
  fetchEvents();
  fetchEventRequests();
});

// Fetch events from database to show on eventList + calendar
async function fetchEvents() {
  try {
    const res = await fetch('http://localhost:8080/api/events');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    //put all event info into eventsCache array
    eventsCache = Array.isArray(data) ? data : [];

    //checks if there is eventList (currently on eventCreation page only)
    if (els.eventList) {

      //clears eventList to prevent duplicate items
      els.eventList.innerHTML = '';

      //if no items, display message instead of empty eventList
      if (eventsCache.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No events.';
        els.eventList.appendChild(li);
      }

      else {
        //render each event
        for (const ev of eventsCache) {
          els.eventList.appendChild(renderEvent(ev));
        }
      }
    }

    try { renderCalendar(); } catch (e) { }

  } catch (err) {
    console.error('Failed to fetch events', err);
  }

  try { populateCancelFormDropdown(); } catch (e) { }
  try { populateUpdateFormDropdown(); } catch (e) { }
}

// Fetch events from event request tables to show on event requests
async function fetchEventRequests() {
  try {
    const res = await fetch('http://localhost:8080/api/eventrequests');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    //put all event info into eventsCache array
    eventRequestsCache = Array.isArray(data) ? data : [];

    //checks if there is requestList (currently on eventCreation page only)
    if (els.requestList) {

      //clears requestList to prevent duplicate items
      els.requestList.innerHTML = '';

      //if no items, display message instead of empty requestList
      if (eventRequestsCache.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No events.';
        els.requestList.appendChild(li);
      }

      else {
        //render each event
        for (const ev of eventRequestsCache) {
          els.requestList.appendChild(renderRequest(ev));
        }
      }
    }

    try { populateCreateFormDropdown(); } catch (e) { }
    try { renderCalendar(); } catch (e) { }

  } catch (err) {
    console.error('Failed to fetch event requests', err);
  }
}

//submit event creation form
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

  //create an event
  fetch('http://localhost:8080/api/ECreation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  }).then(response => response.text())
    .then(data => alert(data))
    .then(() => {
      //refresh event list and calendar
      try { fetchEvents(); } catch (e) { }
    })
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

  const updatedID = els.updatedEventID.value.trim();

  if (!updatedID) {
    showMessage('You must select an event', true);
    return;
  }

  const matches = eventsCache.filter(
    ev => String(updatedID) === String(ev.eventid)
  );

  if (matches.length === 0) {
    alert(`No event found with ID "${updatedID}"`);
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
    .then(() => {
      //refresh event list and calendar
      try { fetchEvents(); } catch (e) { }
    })
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

// Render items as eventList
function renderEvent(item) {
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

function renderRequest(item) {
  const li = document.createElement('li');
  // make the list item clickable and focusable
  li.classList.add("individualItem");
  li.setAttribute('role', 'button');
  li.style.cursor = 'pointer';
  //rendering list
  const eventType = `${item.eventType} --`;
  const performers = ` Performers: ${item.performers},`;
  const attendance = ` Attendance: ${item.attendance},`;
  const ages = ` Ages: ${item.ages},`;
  const eventDetails = ` Event Details: ${item.eventDetails},`;
  const budget = ` Budget: ${item.budget},`;
  const startTime = ` Start Time: ${item.startTime},`;
  const startDate = ` Start Date: ${item.startDate},`;
  li.textContent = `${eventType}${performers}${attendance}${ages}${eventDetails}${budget}${startTime}${startDate}`;

  // click on event from list and populate event creation form
  li.addEventListener('click', () => {
    //use performers and dropdown to populate the form
    populateCreateFormByDropdown(item.performers);
    //focus onto the title field so user can edit form before submitting
    const titleEl = document.getElementById('title');
    if (titleEl) titleEl.focus();
  });

  return li;
}

//populate create event form based on data in event request
async function populateCreateFormByID(id) {
  const form = document.getElementById('createForm');
  if (!form) return;

  // Fetch event request data by ID
  try {
    const response = await fetch(`http://localhost:8080/api/eventrequests/${id}`);
    if (!response.ok) {
      console.error('Error fetching event request:', response.statusText);
      return;
    }
    const data = await response.json();
    if (!data) {
      console.error('Error fetching event request:', response.statusText);
      return;
    }

    // Populate form fields with data
    form.title.value = data.performers || '';
    form.description.value = data.eventDetails || '';
    form.eventdate.value = data.startDate || '';
  }
  catch (err) {
    console.error('Error populating create form by ID:', err);
  }
}

//populate create form by typed name
async function populateCreateFormByName(name) {

  try {
    const form = document.getElementById('createForm');
    if (!form) return;

    const requestTitle = name.value.trim();

    const matches = eventRequestsCache.filter(
      ev => ev.performers === requestTitle
    );

    if (matches.length === 0) {
      console.log('No matching event request found');
      return;
    }

    form.title.value = matches[0].performers || '';
    form.description.value = matches[0].eventDetails || '';
    form.eventdate.value = matches[0].startDate || '';

  } catch (err) {
    console.error(err);
  }
}

//populate create form dropdown with event request performers
async function populateCreateFormDropdown() {
  const dropdown = document.getElementById('createFormData-dropdown');

  try {
    const items = eventRequestsCache;

    dropdown.innerHTML = '<option value="">Select an option</option>';

    //loop through data and create option elements
    items.forEach(item => {
      const option = document.createElement('option');
      option.textContent = item.performers;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//populate create form using dropdown input
function populateCreateFormByDropdown(selectedOption) {
  const form = document.getElementById('createForm');
  if (!form) return;

  const data = eventRequestsCache.find(item => item.performers === selectedOption);
  if (!data) return;

  form.title.value = data.performers || '';
  form.description.value = data.eventDetails || '';
  form.eventdate.value = data.startDate || '';
}

//populate update form dropdown with event request performers
async function populateUpdateFormDropdown() {
  const dropdown = document.getElementById('updateFormData-dropdown');

  try {
    const items = eventsCache;

    dropdown.innerHTML = '<option value="">Select an option</option>';

    //loop through data and create option elements
    items.forEach(item => {
      const option = document.createElement('option');
      // visible text on dropdown
      option.textContent =
        `${item.title} (${item.eventdate})`;
      // unique hidden value
      option.value = item.eventid;

      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//populate update form using dropdown input
function populateUpdateFormByDropdown(selectedOption) {
  const form = document.getElementById('updateForm');
  if (!form) return;

  const data = eventsCache.find(item => String(item.eventid) === String(selectedOption));

  if (!data) return;

  form.updatedTitle.value = data.title || '';
  form.updatedDescription.value = data.description || '';
  form.updatedEventDate.value = data.eventdate || '';
  form.updatedEventTime.value = data.eventtime || '';
  form.updatedVenueID.value = data.venueid || '';
  form.updatedEventID.value = data.eventid || '';
}

//populate cancel event dropdown with event request performers
async function populateCancelFormDropdown() {
  const dropdown = document.getElementById('cancelFormData-dropdown');

  try {
    const items = eventsCache;

    dropdown.innerHTML = '<option value="">Select an option</option>';

    //loop through data and create option elements
    items.forEach(item => {
      const option = document.createElement('option');
      // visible text on dropdown
      option.textContent =
        `${item.title} (${item.eventdate})`;
      // unique hidden value
      option.value = item.eventid;

      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//select event to cancel using dropdown
function populateCancelFormByDropdown(selectedOption) {
  const form = document.getElementById('cancelForm');

// find by event id
  const data = eventsCache.find(
    item => String(selectedOption) === String(item.eventid)
  );

  if (!data) return;

  // fill form fields
  form.cancelledTitle.value = data.title || '';
  form.cancelledEventID.value = data.eventid || '';
}

//cancel an event
cancelForm.addEventListener('submit', function (event) {
  event.preventDefault(); //Prevent default form submission

  const id = document.getElementById('cancelledEventID').value;
  if (!id) {
    return;
  }

  let eventcancelled = null;
  const selectedStatus = cancelForm.eventStatus.value;
  if (selectedStatus && selectedStatus === 'cancel') {
    eventcancelled = true;
  } else if (selectedStatus && selectedStatus === 'activate') {
    eventcancelled = false;
  }

  // if no radio selected, do nothing
  if (eventcancelled === null) {
    showMessage('Please choose Cancel or Activate', true);
    return;
  }

  fetch(`http://localhost:8080/api/events/${id}/cancel`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ eventcancelled: eventcancelled }),
  }).then(response => response.text())
    .then(data => alert(data))
    .then(() => {
      //refresh event list and calendar
      try { fetchEvents(); } catch (e) { }
    })
    .catch(error => console.error('Error:', error));
});



//creates date using current date provided by user's browser
let date = new Date();

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

//render item on calendar with title only
function renderEventSmall(item) {
  const el = document.createElement('div');

  console.log(item);

  //default class
  el.className = 'eventSmall';

  //if event is cancelled
  if (item.eventcancelled === true) {
    el.classList.add('cancelledEvent');
  }

  el.textContent = item.title || '';
  return el;
}

//show events for a specific day on a eventList
function showEventsForDay(isoDate, events) {
  //clear eventList to prevent duplicates
  els.eventList.innerHTML = '';

  //create eventList and show which day
  const header = document.createElement('li');
  header.textContent = `Events for ${isoDate}`;
  els.eventList.appendChild(header);

  //show message if no events found
  if (!events || events.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No events that day.';
    els.eventList.appendChild(li);
    return;
  }

  //render each event
  for (const event of events) {
    els.eventList.appendChild(renderEvent(event));
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
        const small = renderEventSmall(event);
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