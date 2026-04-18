const params = new URLSearchParams(window.location.search);
const eventId = params.get('id');

console.log("URL:", window.location.href);
console.log("Params id:", eventId);

document.addEventListener("DOMContentLoaded", () => {
  if (!eventId) return;
  loadEvent();
});

async function loadEvent() {
  try {
    console.log("Fetching event:", eventId);

    const url = `http://localhost:8080/api/events/${eventId}`;
    console.log("URL:", url);

    const res = await fetch(url);

    console.log("Status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend response:", text);
      throw new Error(`HTTP ${res.status}`);
    }

    const event = await res.json();
    console.log("Event data:", event);

    renderEvent(event);

  } catch (err) {
    console.error(err);
    document.getElementById("eventContainer").innerText =
      "Failed to load event.";
  }
}

function renderEvent(event) {
  document.getElementById("eventContainer").innerHTML = `
    <h1>${event.title}</h1>
    <p><strong>Description:</strong> ${event.description || "N/A"}</p>
    <p><strong>Date:</strong> ${event.eventdate}</p>
    <p><strong>Time:</strong> ${event.eventtime}</p>
    <p><strong>Venue:</strong> ${event.venueid}</p>
  `;
}