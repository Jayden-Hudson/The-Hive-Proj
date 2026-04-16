document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    navbar.innerHTML = `
        <header class="shared-header">
            <h1 class="shared-title">Goldenfield Venue</h1>
            <nav class="shared-nav">
                <ul class="shared-nav-list">
                    <li><a href="Home.html">Home</a></li>
                    <li><a href="TicketProcess.html">Get Tickets</a></li>
                    <li><a href="EventRequest.html">Request Event</a></li>
                    <li><a href="ECreation.html">Create Event</a></li>
                    <li><a href="Calendar.html">Calendar</a></li>
                    <li><a href="employee.html">Employee</a></li>
                </ul>
            </nav>
        </header>
    `;

    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    const links = navbar.querySelectorAll(".shared-nav-list a");

    links.forEach(link => {
        const href = link.getAttribute("href").toLowerCase();
        if (href === currentPage) {
            link.classList.add("active");
        }
    });
});