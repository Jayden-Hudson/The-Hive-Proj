const daysList = document.getElementById('days');
const monthYear = document.getElementById('month-year');
const prevBtn = document.getElementById('previous-month');
const nextBtn = document.getElementById('next-month');
const form = document.getElementById('createForm');

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

// Fetch events from server to show on list + calendar
async function fetchEvents() {
  try {
    const res = await fetch('/api/events');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    eventsCache = Array.isArray(data) ? data : [];

    if (els.list) {
      els.list.innerHTML = '';
      if (eventsCache.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No events.';
        els.list.appendChild(li);
      } else {
        for (const ev of eventsCache) {
          els.list.appendChild(renderItem(ev));
        }
      }
    }
    
      try { renderCalendar(); } catch (e) {  }

  } catch (err) {
    console.error('Failed to fetch events', err);
    showMessage('Failed to load events: ' + err.message, true);
  }
}

form.addEventListener('submit', function (event) {
  event.preventDefault(); //Prevent default form submission

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

let eventsCache = [];

function pad(n) { return n < 10 ? '0' + n : String(n); }

document.addEventListener('DOMContentLoaded', () => {
  els.msg = els.msg || document.getElementById('msg');
  els.form = els.form || document.getElementById('createForm');
  els.refresh = els.refresh || document.getElementById('refreshBtn');

  // Wire refresh button to reload events and do an initial load
  if (els.refresh) {
    els.refresh.addEventListener('click', () => fetchEvents());
  }

  // initial events fetch
  fetchEvents();

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

function showMessage(text, isError = false) {
  if (!els.msg) {
    const found = document.getElementById('msg');
    if (found) els.msg = found;
    else {
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
  const eventdate = ` Event Date: ${item.eventdate},`;
  const eventtime = ` Event Time: ${item.eventtime},`;
  const venueid = ` Venue ID: ${item.venueid}`;
  li.textContent = `${title}${description}${eventdate}${eventtime}${venueid}`;

  return li;
}

function populateUpdateForm(eventData) {
  els.updatedEventID.value = eventData.eventid;
  els.currentTitle.value = eventData.title || '';
  els.updatedTitle.value = eventData.title || '';
  els.updatedDescription.value = eventData.description || '';
  els.updatedEventDate.value = eventData.eventdate || '';
  els.updatedEventTime.value = eventData.eventtime || '';
  els.updatedVenueID.value = eventData.venueid || '';
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
    const dayEvents = eventsCache.filter(event => event.eventdate.split('T')[0] === iso);

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
  const eventEl = e.target.closest('.eventSmall');

    if (!eventEl || !daysList.contains(eventEl)) return;

  const selected = daysList.querySelector('.selected');
  if (selected) selected.classList.remove('selected');

  eventEl.classList.add('selected'); 

  });
