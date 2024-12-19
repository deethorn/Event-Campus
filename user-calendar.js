// Load events from the server
async function loadEvents() {
    try {
        const events = await API.getEvents();
        renderGridView(events);
    } catch (error) {
        console.error('Error loading events:', error);
        alert('Failed to load events');
    }
}

// Render events in grid view
function renderGridView(events) {
    const eventsContainer = document.getElementById('events-container');
    const calendarContainer = document.getElementById('calendar-container');
    
    eventsContainer.innerHTML = '';
    eventsContainer.classList.remove('hidden');
    calendarContainer.classList.add('hidden');

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <img src="${event.cover_image ? `http://localhost:3000${event.cover_image}` : '/images/default-event.jpg'}" 
                 alt="${event.name}" 
                 class="event-image" 
                 onerror="handleImageError(this)">
            <div class="event-details">
                <h3>${event.name}</h3>
                <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Speaker:</strong> ${event.speaker}</p>
                <p><strong>Available Seats:</strong> ${event.seats_available}</p>
                <p><strong>Category:</strong> ${event.category}</p>
                <button class="rsvp-btn" onclick="handleRSVP(${event.id})" 
                    ${event.seats_available <= 0 ? 'disabled' : ''}>
                    ${event.seats_available <= 0 ? 'Fully Booked' : 'RSVP'}
                </button>
            </div>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

// Render events in calendar view
function renderCalendarView(events) {
    const eventsContainer = document.getElementById('events-container');
    const calendarContainer = document.getElementById('calendar-container');
    
    eventsContainer.classList.add('hidden');
    calendarContainer.classList.remove('hidden');
    
    // Clear existing calendar
    calendarContainer.innerHTML = '';
    
    // Create calendar
    const calendar = document.createElement('div');
    calendar.id = 'calendar';
    calendarContainer.appendChild(calendar);

    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
        const date = new Date(event.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(event);
        return acc;
    }, {});

    // Create calendar grid
    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';

    // Add days of week header
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    // Add calendar days
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Add empty cells for days before first of month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyCell);
    }

    // Add days with events
    for (let date = 1; date <= lastDay.getDate(); date++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        const currentDate = new Date(today.getFullYear(), today.getMonth(), date).toLocaleDateString();
        
        const dayEvents = eventsByDate[currentDate] || [];
        
        dayCell.innerHTML = `
            <div class="date-number">${date}</div>
            ${dayEvents.map(event => `
                <div class="calendar-event" onclick="handleRSVP(${event.id})">
                    ${event.name}
                </div>
            `).join('')}
        `;
        
        calendarGrid.appendChild(dayCell);
    }

    calendar.appendChild(calendarGrid);
}

// Add RSVP handling function
async function handleRSVP(eventId) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please log in to RSVP');
            window.location.href = 'login.html';
            return;
        }

        await API.rsvpToEvent(eventId);
        alert('Successfully RSVP\'d to event!');
        // Reload events to update seats
        loadEvents();
    } catch (error) {
        console.error('RSVP error:', error);
        alert(error.message);
    }
}

// Add this function to load RSVPs
async function loadUserRSVPs() {
    try {
        const rsvps = await API.getUserRSVPs();
        const rsvpsContainer = document.getElementById('rsvps-container');
        
        if (rsvps.length === 0) {
            rsvpsContainer.innerHTML = '<p>You haven\'t RSVP\'d to any events yet.</p>';
            return;
        }

        rsvpsContainer.innerHTML = '<div class="rsvp-grid">' + 
            rsvps.map(event => `
                <div class="rsvp-card">
                    <img src="${event.cover_image ? `http://localhost:3000${event.cover_image}` : '/images/default-event.jpg'}" 
                         alt="${event.name}" 
                         class="event-image" 
                         onerror="handleImageError(this)">
                    <div class="rsvp-details">
                        <h3>${event.name}</h3>
                        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                        <p><strong>Location:</strong> ${event.location}</p>
                        <p><strong>RSVP Date:</strong> ${new Date(event.rsvp_date).toLocaleString()}</p>
                    </div>
                </div>
            `).join('') + 
        '</div>';
    } catch (error) {
        console.error('Error loading RSVPs:', error);
        alert('Failed to load your RSVPs');
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load events when page loads
    loadEvents();
    loadUserRSVPs();

    // View toggle buttons
    document.getElementById('view-in-grid').addEventListener('click', async () => {
        const events = await API.getEvents();
        renderGridView(events);
    });

    document.getElementById('view-in-calendar').addEventListener('click', async () => {
        const events = await API.getEvents();
        renderCalendarView(events);
    });

    // Filter form
    document.getElementById('filter-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const filters = {
            name: document.getElementById('filter-name').value,
            date: document.getElementById('filter-date').value,
            location: document.getElementById('filter-location').value,
            category: document.getElementById('filter-category').value,
            seats: document.getElementById('filter-seats').value
        };

        try {
            const events = await API.getEvents();
            const filteredEvents = events.filter(event => {
                // Convert event date to YYYY-MM-DD format for comparison
                const eventDate = new Date(event.date).toISOString().split('T')[0];
                
                return (!filters.name || event.name.toLowerCase().includes(filters.name.toLowerCase())) &&
                       (!filters.date || eventDate === filters.date) &&
                       (!filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase())) &&
                       (!filters.category || event.category.toLowerCase() === filters.category.toLowerCase()) &&
                       (!filters.seats || event.seats_available >= parseInt(filters.seats) || isNaN(parseInt(filters.seats)));
            });

            // Check if we're in grid or calendar view
            const calendarContainer = document.getElementById('calendar-container');
            if (calendarContainer.classList.contains('hidden')) {
                renderGridView(filteredEvents);
            } else {
                renderCalendarView(filteredEvents);
            }
        } catch (error) {
            console.error('Error filtering events:', error);
            alert('Failed to filter events');
        }
    });
});
