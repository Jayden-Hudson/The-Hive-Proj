const API_URL = 'http://127.0.0.1:3000/events';

const daysList = document.getElementById('days');
const monthYear = document.getElementById('month-year');
const prevBtn = document.getElementById('previous-month');
const nextBtn = document.getElementById('next-month');

const els = {
  list: document.getElementById('eventList'),
  refresh: document.getElementById('refreshBtn'),
  form: document.getElementById('addForm'),
  eventName: document.getElementById('eventName'),
  eventType: document.getElementById('eventType'),
  eventPerformers: document.getElementById('eventPerformers'),
  eventDate: document.getElementById('eventDate'),
  eventTime: document.getElementById('eventTime'),
  eventAges: document.getElementById('eventAges'),
};


let eventsCache = [];

//pad dates for iso format
function pad(n) { return n < 10 ? '0' + n : String(n); }

function showMessage(text) {
  if (!els.msg) return;
  else {
    els.msg.textContent = text;
  }
}

// Render items as list
function renderItem(item) {
  const li = document.createElement('li');
  const eventName = `${item.eventName} --`;
  const eventType = ` Event type: ${item.eventType},`;
  const eventPerformers = ` Performers: ${item.eventPerformers},`;
  const eventDate = ` Event Date: ${item.eventDate},`;
  const eventTime = ` Event Time: ${item.eventTime},`;
  const eventAges = ` Ages: ${item.eventAges}`;
  li.textContent = `${eventName}${eventType}${eventPerformers}${eventDate}${eventTime}${eventAges}`;
  return li;
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
    eventName: els.eventName.value.trim(),
    eventType: els.eventType.value.trim(),
    eventPerformers: els.eventPerformers.value.trim(),
    eventDate: els.eventDate.value.trim(),
    eventTime: els.eventTime.value.trim(),
    eventAges: els.eventAges.value.trim(),
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
  el.textContent = item.eventName || '';
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
