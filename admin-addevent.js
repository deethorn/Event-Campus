const addEventForm = document.getElementById("add-event-form");
const eventsTable = document.getElementById("events-table").querySelector("tbody");

// Load all events
async function loadEvents() {
    try {
        const events = API.getEvents();
        eventsTable.innerHTML = '';
        events.forEach(event => {
            const row = createEventRow(event);
            eventsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading events:', error);
        alert('Failed to load events');
    }
}

// Create event row
function createEventRow(event) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${event.id}</td>
        <td>${event.name}</td>
        <td>${new Date(event.date).toLocaleDateString()}</td>
        <td>${event.location}</td>
        <td>${event.description}</td>
        <td>${event.speaker}</td>
        <td>${event.seats_available}</td>
        <td>${event.category}</td>
        <td><img src="${event.cover_image}" alt="Event Image" style="width: 50px; height: auto;"></td>
        <td>
            <button class="edit-btn" data-id="${event.id}">Edit</button>
            <button class="delete-btn" data-id="${event.id}">Delete</button>
        </td>
    `;
    return row;
}

// Add event form submission
addEventForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const eventData = {
        name: document.getElementById('event-name').value,
        date: document.getElementById('event-date').value,
        location: document.getElementById('event-location').value,
        description: document.getElementById('event-description').value,
        speaker: document.getElementById('event-speaker').value,
        seats_available: document.getElementById('event-seats').value,
        category: document.getElementById('event-category').value,
        cover_image: document.getElementById("event-cover-image").files[0]
    }

    try {
        API.createEvent(eventData);
        loadEvents();
        addEventForm.reset();
        alert('Event added successfully!');
    } catch (error) {
        console.error('Error adding event:', error);
        alert('Failed to add event');
    }
});

// Delete event handler
eventsTable.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        const eventId = e.target.dataset.id;
        try {
            API.deleteEvent(eventId);
            loadEvents();
            alert('Event deleted successfully!');
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event');
        }
    }
});

// Load events when page loads
document.addEventListener('DOMContentLoaded', loadEvents);