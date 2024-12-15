document.addEventListener('DOMContentLoaded', () => {
    const events = [
        { title: "Hackathon 2024", date: "2024-12-10", location: "Hall A", category: "Tech", seats: 50 },
        { title: "Music Fest", date: "2024-12-15", location: "Main Lawn", category: "Entertainment", seats: 200 },
    ];

    const eventsContainer = document.getElementById("events-container");

    if (eventsContainer) {
        renderEvents(events);
    }

    function renderEvents(events) {
        eventsContainer.innerHTML = "";
        events.forEach(event => {
            const eventCard = document.createElement("div");
            eventCard.classList.add("event-card");
            eventCard.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Seats:</strong> ${event.seats}</p>
            `;
            eventsContainer.appendChild(eventCard);
        });
    }
});
