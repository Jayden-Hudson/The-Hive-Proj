
const API_URL = 'http://127.0.0.1:3000/events';

const els = {
  list: document.getElementById('eventList'),
  refresh: document.getElementById('refreshBtn'),
  form: document.getElementById('addForm'),
  eventName: document.getElementById('eventName'),
  performers: document.getElementById('performers'),
  eventDate: document.getElementById('eventDate'),
  eventTime: document.getElementById('eventTime'),
};

function showMessage(text, isError = false) {
  if (!els.msg) return;
  els.msg.textContent = text;
  els.msg.className = isError ? 'error' : 'ok';
}

// Render items as list
function renderItem(item) {
  const li = document.createElement('li');
  const eventName = item.eventName = `${item.eventName} --`;
  const performers = item.performers != null ? ` Performers:${item.performers},` : '';
  const eventDate = item.eventDate != null ? ` Event Date:${item.eventDate},` : '';
  const eventTime = item.eventTime != null ? ` Event Time:${item.eventTime}` : '';
  li.textContent = `${eventName}${performers}${eventDate}${eventTime}`;
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
    } else {
      for (const item of items) {
        els.list.appendChild(renderItem(item));
      }
    }
    showMessage(`Loaded ${items.length} item(s).`);
  } catch (err) {
    showMessage('Error loading items: ' + err.message, true);
  }
}

async function handleAdd(e) {
  e.preventDefault();

  // Basic body using the generic fields.
  const body = {
    eventName: els.eventName.value.trim(),
    performers: els.performers.value.trim() || null,
    eventDate: els.eventDate.value.trim(),
    eventTime: els.eventTime.value.trim(),
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

// Wire events
document.addEventListener('DOMContentLoaded', loadItems);
els.refresh?.addEventListener('click', loadItems);
els.form?.addEventListener('submit', handleAdd);


//adding to the calendar

document.getElementById('addForm').addEventListener('submit', (e) => {
  const eventName = document.getElementById('eventName').value;
  const performers = document.getElementById('performers').value;
  const eventDate = document.getElementById('eventDate').value; 
  const eventTime = document.getElementById('eventTime').value;

  // events from localStorage
  const events = JSON.parse(localStorage.getItem('events') || '[]');

  // Add new event
  events.push({ eventDate, eventName, performers, eventTime });

  // Save events to localStorage
  localStorage.setItem('events', JSON.stringify(events));

  // calendar page
  window.location.href = 'calendar.html';
});



