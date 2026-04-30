const els = {
  daysList: document.getElementById('days'),
  monthYear: document.getElementById('monthyear'),
  prevBtn: document.getElementById('previous-month'),
  nextBtn: document.getElementById('nextmonth'),
  selectedDateLabel: document.getElementById('selectedDateLabel'),
  selectedEventList: document.getElementById('selectedEventList'),
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

let eventsCache = [];
let currentMonth = new Date();
let selectedIso = null;

function pad(n) {
  return n < 10 ? '0' + n : String(n);
}

function getIsoDate(dateObj) {
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;
}

function formatDisplayDate(iso) {
  if (!iso) return 'Choose a day';

  const parts = iso.split('-');
  if (parts.length !== 3) return iso;

  return `${months[Number(parts[1]) - 1]} ${Number(parts[2])}, ${parts[0]}`;
}

function normalizeEvent(event) {
  const rawDate =
    event.eventdate ||
    event.date ||
    event.startdate ||
    event.startDate ||
    '';

  const title =
    event.title ||
    event.eventtitle ||
    event.name ||
    'Untitled Event';

  const description =
    event.description ||
    event.details ||
    event.additionaleventdetails ||
    'No extra details available yet.';

  const rawTime =
    event.time ||
    event.starttime ||
    event.eventtime ||
    '';

  const location =
    event.location ||
    event.venue ||
    'Goldenfield Venue';

  return {
    title,
    description,
    date: String(rawDate).split('T')[0],
    time: rawTime,
    location,
  };
}

async function fetchEvents() {
  try {
    const res = await fetch('http://localhost:8080/api/events');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const rawEvents = Array.isArray(data) ? data : [];
    eventsCache = rawEvents.map(normalizeEvent);
  } catch (err) {
    console.error('Failed to fetch events', err);
    eventsCache = [];
  }

  renderCalendar();

  if (!selectedIso) {
    selectedIso = getIsoDate(new Date());
  }

  renderSelectedEvents(selectedIso);
}

function renderCalendar() {
  if (!els.daysList || !els.monthYear) return;

  els.daysList.innerHTML = '';

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  els.monthYear.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.className = 'empty';
    els.daysList.appendChild(blank);
  }

  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'calendarDay';

    const iso = `${year}-${pad(month + 1)}-${pad(day)}`;
    cell.dataset.date = iso;

    if (iso === selectedIso) {
      cell.classList.add('selected');
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'dayNumber';
    dayNumber.textContent = String(day);
    cell.appendChild(dayNumber);

    const dayEvents = eventsCache.filter(event => event.date === iso);

    if (dayEvents.length > 0) {
      const container = document.createElement('div');
      container.className = 'dayEventsContainer';

      dayEvents.slice(0, 3).forEach(event => {
        const tag = document.createElement('div');
        tag.className = 'eventSmall';
        tag.textContent = event.title;
        container.appendChild(tag);
      });

      cell.appendChild(container);
    }

    els.daysList.appendChild(cell);
  }
}

function renderSelectedEvents(iso) {
  if (!els.selectedDateLabel || !els.selectedEventList) return;

  els.selectedDateLabel.textContent = formatDisplayDate(iso);
  els.selectedEventList.innerHTML = '';

  const matchingEvents = eventsCache.filter(event => event.date === iso);

  if (!matchingEvents.length) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'emptyState';
    emptyItem.textContent = 'No events scheduled for this day.';
    els.selectedEventList.appendChild(emptyItem);
    return;
  }

  matchingEvents.forEach(event => {
    const item = document.createElement('li');
    item.className = 'selectedEventItem';
    item.innerHTML = `
      <h5>${event.title}</h5>
      <div class="eventMeta">
        <span>${event.time || 'Time TBD'}</span>
        <span>${event.location}</span>
      </div>
      <p class="eventDescription">${event.description}</p>
    `;
    els.selectedEventList.appendChild(item);
  });
}

function setupAutoHideNavbar() {
  const header = document.querySelector('header');

  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('nav-hidden');
    } else {
      header.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  });
}

function bindEvents() {
  if (els.prevBtn) {
    els.prevBtn.addEventListener('click', () => {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      renderCalendar();
    });
  }

  if (els.nextBtn) {
    els.nextBtn.addEventListener('click', () => {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      renderCalendar();
    });
  }

  if (els.daysList) {
    els.daysList.addEventListener('click', (e) => {
      const cell = e.target.closest('.calendarDay');
      if (!cell) return;

      selectedIso = cell.dataset.date;
      renderCalendar();
      renderSelectedEvents(selectedIso);
    });
  }
}

function setupAutoHideNavbar() {
  const header = document.querySelector('header');

  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('nav-hidden');
    } else {
      header.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  selectedIso = getIsoDate(new Date());
  setupAutoHideNavbar();
  bindEvents();
  fetchEvents();
});