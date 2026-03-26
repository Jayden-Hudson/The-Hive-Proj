const API_URL = 'http://127.0.0.1:3000/events';

const daysList = document.getElementById('days');
const monthYear = document.getElementById('month-year');
const prevBtn = document.getElementById('previous-month');
const nextBtn = document.getElementById('next-month');

const els = {
  list: document.getElementById('eventList'),
  refresh: document.getElementById('refreshBtn'),
  form: document.getElementById('addForm'),
  msg: document.getElementById('msg'),
  title: document.getElementById('title'),
  description: document.getElementById('description'),
  eventDate: document.getElementById('eventDate'),
  eventTime: document.getElementById('eventTime'),
  venueID: document.getElementById('venueID'),
  // update form elements
  updateForm: document.getElementById('updateForm'),
  updatedEventID: document.getElementById('updatedEventID'),
  updatedTitle: document.getElementById('updatedTitle'),
  updatedDescription: document.getElementById('updatedDescription'),
  updatedEventDate: document.getElementById('updatedEventDate'),
  updatedEventTime: document.getElementById('updatedEventTime'),
  updatedVenueID: document.getElementById('updatedVenueID'),
};


let eventsCache = [];

//pad dates for iso format
function pad(n) { return n < 10 ? '0' + n : String(n); }

function showMessage(text, isError = false) {
  if (!els.msg) return;
  els.msg.textContent = text;
  els.msg.className = isError ? 'msg error' : 'msg';
}

// Render items as list
function renderItem(item) {
  const li = document.createElement('li');
  const title = `${item.title} --`;
  const description = ` Description: ${item.description},`;
  const eventDate = ` Event Date: ${item.eventDate},`;
  const eventTime = ` Event Time: ${item.eventTime},`;
  const venueID = ` Venue ID: ${item.venueID}`;
  li.textContent = `${title}${description}${eventDate}${eventTime}${venueID}`;
  // store event id on the list item for quick access
  li.dataset.eventId = item.eventID;
  return li;
}

// Populate update form with an event object
function populateUpdateForm(event) {
  els.updatedEventID.value = event.eventID;
  els.updatedTitle.value = event.title || '';
  els.updatedDescription.value = event.description || '';
  els.updatedEventDate.value = event.eventDate || '';
  els.updatedEventTime.value = event.eventTime || '';
  els.updatedVenueID.value = event.venueID || '';
}

// Client PUT helper
async function updateEvent(eventID, data) {
  const res = await fetch(`${API_URL}/${eventID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.status === 200) return await res.json();

  if (res.status === 404) throw new Error('Event not found');
  if (res.status === 422) {
    const err = await res.json().catch(() => ({}));
    const details = err?.error?.details?.join(', ') || err?.error?.message || 'Invalid input';
    throw new Error('Validation error: ' + details);
  }
  throw new Error('Unexpected status: ' + res.status);
}

async function loadItems() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    els.list.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No items yet.';
      els.list.appendChild(li);
      eventsCache = [];
    } else {
      // store events in cache for calendar rendering
      eventsCache = Array.isArray(items) ? items : [];
      for (const item of eventsCache) {
        els.list.appendChild(renderItem(item));
      }
    }
    showMessage(`Loaded ${items.length} item(s).`);

    renderCalendar();
  } catch (err) {
    showMessage('Error loading items: ' + err.message, true);
  }
}

async function handleAdd(e) {
  e.preventDefault();

  // Basic body using the generic fields.
  const body = {
    title: els.title.value.trim(),
    description: els.description.value.trim(),
    eventDate: els.eventDate.value.trim(),
    eventTime: els.eventTime.value.trim(),
    venueID: els.venueID.value.trim(),
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 201) {
      showMessage('Item added.');
      els.form.reset();
      await loadItems();
      return;
    }

    if (res.status === 422) {
      let errJson = {};
      try {
        errJson = await res.json();
      } catch (_) { }
      const details =
        errJson?.error?.details?.join(', ') ||
        errJson?.error?.message ||
        'Invalid input';
      showMessage('Validation error: ' + details, true);
      return;
    }

    showMessage(`Unexpected status: ${res.status}`, true);
  } catch (err) {
    showMessage('Network error: ' + err.message, true);
  }
}

//rendering calendar

let date = new Date();

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function renderItemSmall(item) {
  const el = document.createElement('div');
  el.className = 'eventSmall';
  el.textContent = item.title || '';
  return el;
}

function showEventsForDay(isoDate, events) {
  els.list.innerHTML = '';
  const header = document.createElement('li');
  header.textContent = `Events for ${isoDate}`;
  els.list.appendChild(header);

  if (!events || events.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No events that day.';
    els.list.appendChild(li);
    return;
  }

  for (const event of events) {
  const li = renderItem(event);
  // clicking a list item will populate the update form for editing
  li.addEventListener('click', () => populateUpdateForm(event));
  els.list.appendChild(li);
  }
}

function renderCalendar() {


  daysList.innerHTML = '';

  const month = date.getMonth();
  const year = date.getFullYear();

  monthYear.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();


  for (let i = 0; i < firstDay; i++) {
    const beforeFirstday = document.createElement('div');
    beforeFirstday.classList.add('empty');
    daysList.appendChild(beforeFirstday);
  }

  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement('div');
    cell.className = 'calendarDay';

    const dayNumber = document.createElement('div');
    dayNumber.className = 'dayNumber';
    dayNumber.textContent = day;
    cell.appendChild(dayNumber);

    const iso = `${year}-${pad(month + 1)}-${pad(day)}`;
    const dayEvents = eventsCache.filter(event => event.eventDate === iso);
    if (dayEvents.length > 0) {
      const container = document.createElement('div');
      container.className = 'dayEventsContainer';
      for (const event of dayEvents) {
        const small = renderItemSmall(event);
        container.appendChild(small);
      }
      cell.appendChild(container);
    }

    cell.addEventListener('click', () => showEventsForDay(iso, dayEvents));

    daysList.appendChild(cell);
  }
}


prevBtn.addEventListener('click', () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();


daysList.addEventListener('click', (e) => {
  if (e.target.classList.contains('empty')) return;
  const selected = daysList.querySelector('.selected');

  if (selected) selected.classList.remove('selected');
  e.target.classList.add('selected');

  const day = Number(e.target.textContent);
  date.setDate(day);
});


// Wire events
document.addEventListener('DOMContentLoaded', loadItems);
els.refresh?.addEventListener('click', loadItems);
els.form?.addEventListener('submit', handleAdd);
// wire the update form submit — if no ID is provided, try to find by name
els.updateForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  let id = Number(els.updatedEventID.value);
  const name = els.updatedTitle.value.trim();

  if (!id) {
    if (!name) {
      showMessage('No event selected to update and no name provided', true);
      return;
    }
    // find events with an exact title match
    const matches = eventsCache.filter(ev => String(ev.title).trim() === name);
    if (matches.length === 0) {
      showMessage(`No event found with name "${name}"`, true);
      return;
    }
    if (matches.length > 1) {
      showMessage(`Multiple events found with name "${name}" — updating the first match.`);
    }
    id = matches[0].eventID;
  }

  const body = {
    title: els.updatedTitle.value.trim(),
    description: els.updatedDescription.value.trim(),
    eventDate: els.updatedEventDate.value.trim(),
    eventTime: els.updatedEventTime.value.trim(),
    venueID: els.updatedVenueID.value.trim(),
  };

  try {
    await updateEvent(id, body);
    showMessage('Event updated.');
    els.updateForm.reset();
    await loadItems();
  } catch (err) {
    showMessage(err.message, true);
  }
});