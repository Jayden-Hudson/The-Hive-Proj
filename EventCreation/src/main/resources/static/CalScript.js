const els = {
  daysList: document.getElementById('days'),
  monthYear: document.getElementById('month-year'),
  prevBtn: document.getElementById('previous-month'),
  nextBtn: document.getElementById('next-month'),
  list: document.getElementById('eventList'),
};

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');
const modalActions = document.getElementById('modalActions');

const daysList = els.daysList;
const monthYear = els.monthYear;
const prevBtn = els.prevBtn;
const nextBtn = els.nextBtn;

let eventsCache = [];
function pad(n) { return n < 10 ? '0' + n : String(n); }
let date = new Date();

document.addEventListener('DOMContentLoaded', () => {
  // initial load
  fetchEvents();
});

async function fetchEvents() {
  try {
    const res = await fetch('http://localhost:8080/api/events');
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

    try { renderCalendar(); } catch (e) { }

  } catch (err) {
    console.error('Failed to fetch events', err);
  }
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function renderItemFull(item) {
  const el = document.createElement('div');
  el.className = 'eventFull';
  // Attach a stable id for the event. backend may use `eventid` or `id`.
  const stableId = item && (item.eventid || item.id || item.eventId || item.eventId);
  if (stableId) el.dataset.id = stableId;
  el.innerHTML = `
    <strong>${item.title || ''}</strong><br>
    Description: ${item.description || ''}<br>
    Event Time: ${item.eventtime || ''}<br>
    Venue ID: ${item.venueid || ''}<br>
  `;
  
  return el;
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
    const dayEvents = eventsCache.filter(event => {
      if (!event) return false;
      let d = event.eventdate;
      if (!d) return false;
      if (typeof d !== 'string') d = String(d);
      return d.split('T')[0] === iso;
    });

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
  const eventEl = e.target.closest('.eventFull');
  if (!eventEl || !daysList.contains(eventEl)) return;

  const eventId = eventEl.dataset.id;

  openEventModal(eventId);
});

function openEventModal(id) {
  const event = eventsCache.find(e => (e.eventid && e.eventid == id) || (e.id && e.id == id));
  if (!event) return;

  if (modalBody) {
    modalBody.innerHTML = `
      <h2>${event.title}</h2>
      <p><strong>Description:</strong> ${event.description || 'N/A'}</p>
      <p><strong>Date:</strong> ${event.eventdate || event.eventDate || ''}</p>
      <p><strong>Time:</strong> ${event.eventtime || event.eventTime || ''}</p>
      <p><strong>Venue:</strong> ${event.venueid || event.venueId || ''}</p>

    `;

    modalActions.innerHTML = `
    <button id="openPageBtn">Open Page</button>
  `;

  modal.classList.remove('hidden');

  document.getElementById('openPageBtn').onclick = () => {
    const openId = event.eventid || event.id || event.eventId;
    if (!openId) {
      console.error('No id available for event', event);
      return;
    }
    window.location.href = `/event.html?id=${encodeURIComponent(openId)}`;
  };

  };

  if (modal) modal.classList.remove('hidden');
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    if (modal) modal.classList.add('hidden');
  });
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}


