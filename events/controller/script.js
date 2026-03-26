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


 
let eventsCache = [];

function pad(n) { return n < 10 ? '0' + n : String(n); }

document.addEventListener('DOMContentLoaded', () => {
  els.msg = els.msg || document.getElementById('msg');
  els.form = els.form || document.getElementById('addForm');
  els.refresh = els.refresh || document.getElementById('refreshBtn');

  els.form?.addEventListener('submit', handleAdd);
  els.refresh?.addEventListener('click', loadItems);

  loadItems();
});

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

  const date = (obj.eventDate || '').trim();
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push('eventDate must be YYYY-MM-DD');
  }

  const time = (obj.eventTime || '').trim();
  if (time && !/^\d{1,2} (AM|PM)$/.test(time)) {
    errors.push('eventTime must be HH (AM|PM)');
  }

  const venueID = (obj.venueID || '').trim();
  if (venueID && isNaN(Number(venueID))) {
    errors.push('venueID must be numeric');
  }

  return { valid: errors.length === 0, errors };
}

function showMessage(text, isError = false) {
  if (!els.msg) {
    const found = document.getElementById('msg');
    if (found) els.msg = found;
    else {
      // create minimal visible fallback
      const message = document.createElement('div');
      message.id = 'msg';
      message.className = 'msg';
      document.body.prepend(message);
      els.msg = message;
    }
  }
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
  return li;
}

function populateUpdateForm(event) {
  els.updatedEventID.value = event.eventID;
  els.currentTitle.value = event.currentTitle || '';
  els.updatedTitle.value = event.updatedTitle || '';
  els.updatedDescription.value = event.updatedDescription || '';
  els.updatedEventDate.value = event.updatedEventDate || '';
  els.updatedEventTime.value = event.updatedEventTime || '';
  els.updatedVenueID.value = event.updatedVenueID || '';
}

async function updateEvent(eventID, data) {
  // client-side validation before sending to server
  const validation = validateEvent(data);
  if (!validation.valid) {
    showMessage('Validation error: ' + validation.errors.join(', '), true);
    return;
  }

  const res = await fetch(`${API_URL}/${eventID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.status === 200) {
    showMessage('Item added.');
    els.form.reset();
    await loadItems();
    return;
  }

  if (res.status === 422) {
  let errJson = {};
  try { errJson = await res.json(); } catch (_) {}
  const details =
    errJson?.error?.details?.join(', ') ||
    errJson?.error?.message ||
    'Invalid input';
    showMessage('Validation error: ' + details, true);
    return;
  }

  showMessage(`Unexpected status: ${res.status}`, true);
}

async function deleteEvent(eventID) {
  const res = await fetch(`${API_URL}/${eventID}`, {
    method: 'DELETE'
  });

  if (res.status === 204) {
    showMessage('Item deleted.');
    els.deleteForm?.reset();
    await loadItems();
    return;
  }

  if (res.status === 422) {
    let errJson = {};
    try { errJson = await res.json(); } catch (_) {}
    const details =
        errJson?.error?.details?.join(', ') ||
        errJson?.error?.message ||
        'Invalid input';
    showMessage('Validation error: ' + details, true);
    return;
  }

  showMessage(`Unexpected status: ${res.status}`, true);
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

  // run client-side validation
  const validation = validateEvent(body);
  if (!validation.valid) {
    showMessage('Validation error: ' + validation.errors.join(', '), true);
    return;
  }

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
    els.list.appendChild(renderItem(event));
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
    dayNumber.textContent = day.toString();
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

els.updateForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  let id = Number(els.updatedEventID.value);
  const title = els.currentTitle.value.trim();

  if (!id) {
    if (!title) {
      showMessage('You must select an event and provide a title', true);
      return;
    }
    const matches = eventsCache.filter(ev => String(ev.title).trim() === title);
    if (matches.length === 0) {
      showMessage(`No event found with name "${title}"`, true);
      return;
    }
    if (matches.length > 1) {
      showMessage(`Multiple events found with name "${title}" — updating the first match.`);
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

els.deleteForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  let id = Number(els.deletedEventID.value);
  const title = els.deletedTitle.value.trim();

  if (!id) {
    if (!title) {
      showMessage('You must select an event and provide a title', true);
      return;
    }
    const matches = eventsCache.filter(ev => String(ev.title).trim() === title);
    if (matches.length === 0) {
      showMessage(`No event found with name "${title}"`, true);
      return;
    }
    if (matches.length > 1) {
      showMessage(`Multiple events found with name "${title}" — deleting the first match.`);
    }
    id = matches[0].eventID;
  }

  const body = {
    title: els.deletedTitle.value.trim(),
  };

  try {
    await deleteEvent(id, body);
    showMessage('Event deleted.');
    els.updateForm.reset();
    await loadItems();
  } catch (err) {
    showMessage(err.message, true);
  }
});



