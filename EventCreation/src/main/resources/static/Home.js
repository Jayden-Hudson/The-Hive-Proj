const els = {
  daysList: document.getElementById('days'),
  monthYear: document.getElementById('month-year'),
  prevBtn: document.getElementById('previous-month'),
  nextBtn: document.getElementById('next-month'),
  list: document.getElementById('eventList'),
};

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

    try { renderCalendar(); } catch (e) {  }

  } catch (err) {
    console.error('Failed to fetch events', err);
  }
}

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

    daysList.appendChild(cell);
  }
}

  renderCalendar();

  daysList.addEventListener('click', (e) => {
    if (e.target.classList.contains('empty')) return;
    const selected = daysList.querySelector('.selected');

    if (selected) selected.classList.remove('selected');
    e.target.classList.add('selected');

    const day = Number(e.target.textContent);
    date.setDate(day);
  });