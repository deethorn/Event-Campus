// // Dummy Event Data
// const events = [
//     { id: 1, name: "Workshop on AI", date: "2024-12-10", location: "Hall A", category: "Workshops", image: "ai-workshop.jpg" },
//     { id: 2, name: "Club Meetup", date: "2024-12-12", location: "Room 204", category: "Club Events", image: "club-meetup.jpg" },
//     { id: 3, name: "Seminar on Tech", date: "2024-12-15", location: "Main Auditorium", category: "Seminars", image: "tech-seminar.jpg" },
// ];

// // Selectors
// const viewInGridButton = document.getElementById("view-in-grid");
// const viewInCalendarButton = document.getElementById("view-in-calendar");
// const eventsContainer = document.getElementById("events-container");
// const calendarContainer = document.getElementById("calendar-container");
// const calendar = document.getElementById("calendar");
// const rsvpModal = document.getElementById("rsvp-modal");
// const closeModal = document.getElementById("close-modal");
// const rsvpForm = document.getElementById("rsvp-form");
// let selectedEventId = null;


// // Update renderGridView to include RSVP button functionality
// function renderGridView() {
//     eventsContainer.innerHTML = "";
//     events.forEach(event => {
//         const eventCard = document.createElement("div");
//         eventCard.classList.add("event-card");
//         eventCard.innerHTML = `
//             <img src="${event.image}" alt="${event.name}">
//             <div class="event-details">
//                 <h3>${event.name}</h3>
//                 <p><strong>Date:</strong> ${event.date}</p>
//                 <p><strong>Location:</strong> ${event.location}</p>
//                 <p><strong>Category:</strong> ${event.category}</p>
//                 <button class="rsvp-btn" data-id="${event.id}">RSVP</button>
//             </div>
//         `;
//         eventsContainer.appendChild(eventCard);
//     });

//     // Attach RSVP Button Events
//     const rsvpButtons = document.querySelectorAll(".rsvp-btn");
//     rsvpButtons.forEach(button => {
//         button.addEventListener("click", (e) => {
//             selectedEventId = parseInt(e.target.dataset.id);
//             rsvpModal.classList.remove("hidden");
//         });
//     });
// }

// // Close Modal
// closeModal.addEventListener("click", () => {
//     rsvpModal.classList.add("hidden");
// });

// // Handle RSVP Form Submission
// rsvpForm.addEventListener("rsvp-submit", (e) => {
//     e.preventDefault();

//     const userName = document.getElementById("user-name-rsvp").value.trim();
//     const userEmail = document.getElementById("user-email-rsvp").value.trim();

//     if (!userName || !userEmail) {
//         alert("Please fill out all fields.");
//         return;
//     }

//     // Confirm reservation
//     const reservedEvent = events.find(ev => ev.id === selectedEventId);
//     if (reservedEvent) {
//         alert(`Reservation confirmed for ${reservedEvent.name}!`);
//     }

//     // Close Modal
//     rsvpModal.classList.add("hidden");
// });


// // Render Calendar View
// function renderCalendarView() {
//     calendar.innerHTML = "";
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = today.getMonth();
//     const firstDay = new Date(year, month, 1).getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();

//     for (let i = 0; i < firstDay; i++) {
//         calendar.innerHTML += `<div></div>`;
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//         const dateCell = document.createElement("div");
//         dateCell.classList.add("calendar-day");
//         dateCell.innerHTML = `<h4>${day}</h4>`;
        
//         events.forEach(event => {
//             const eventDate = new Date(event.date);
//             if (eventDate.getDate() === day && eventDate.getMonth() === month) {
//                 const eventLabel = document.createElement("div");
//                 eventLabel.classList.add("event");
//                 eventLabel.textContent = event.name;
//                 dateCell.appendChild(eventLabel);
//             }
//         });

//         calendar.appendChild(dateCell);
//     }
// }

// // Event Listeners
// viewInGridButton.addEventListener("click", () => {
//     eventsContainer.classList.remove("hidden");
//     calendarContainer.classList.add("hidden");
//     renderGridView();
// });

// viewInCalendarButton.addEventListener("click", () => {
//     calendarContainer.classList.remove("hidden");
//     eventsContainer.classList.add("hidden");
//     renderCalendarView();
// });

// // Initial Load
// renderGridView();

// Dummy Event Data
// Dummy Event Data
const events = [
    { id: 1, name: "Workshop on AI", date: "2024-12-10", location: "Hall A", category: "Workshops", image: "ai-workshop.jpg" },
    { id: 2, name: "Club Meetup", date: "2024-12-12", location: "Room 204", category: "Club Events", image: "club-meetup.jpg" },
    { id: 3, name: "Seminar on Tech", date: "2024-12-15", location: "Main Auditorium", category: "Seminars", image: "tech-seminar.jpg" },
];

// Selectors
const viewInGridButton = document.getElementById("view-in-grid");
const viewInCalendarButton = document.getElementById("view-in-calendar");
const eventsContainer = document.getElementById("events-container");
const calendarContainer = document.getElementById("calendar-container");
const calendar = document.getElementById("calendar");

// Modal Elements
const rsvpModal = document.getElementById("rsvp-modal");
const modalCloseButton = document.getElementById("modal-close");
const modalForm = document.getElementById("rsvp-form");
const modalEventName = document.getElementById("modal-event-name");
const userNameInput = document.getElementById("user-name");
const userEmailInput = document.getElementById("user-email");

// Render Grid View
function renderGridView() {
    eventsContainer.innerHTML = "";
    events.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.innerHTML = `
            <img src="${event.image}" alt="${event.name}">
            <div class="event-details">
                <h3>${event.name}</h3>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Category:</strong> ${event.category}</p>
                <button class="rsvp-btn" data-event-id="${event.id}">RSVP</button>
            </div>
        `;
        eventsContainer.appendChild(eventCard);
    });

    // Add RSVP button event listeners
    document.querySelectorAll(".rsvp-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const eventId = e.target.getAttribute("data-event-id");
            openRSVPModal(eventId);
        });
    });
}

// Render Calendar View
function renderCalendarView() {
    calendar.innerHTML = "";
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendar.innerHTML += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateCell = document.createElement("div");
        dateCell.classList.add("calendar-day");
        dateCell.innerHTML = `<h4>${day}</h4>`;

        events.forEach((event) => {
            const eventDate = new Date(event.date);
            if (eventDate.getDate() === day && eventDate.getMonth() === month) {
                const eventLabel = document.createElement("div");
                eventLabel.classList.add("event");
                eventLabel.textContent = event.name;
                dateCell.appendChild(eventLabel);
            }
        });

        calendar.appendChild(dateCell);
    }
}

// RSVP Modal Functions
function openRSVPModal(eventId) {
    const event = events.find((e) => e.id === parseInt(eventId));
    if (event) {
        modalEventName.textContent = event.name;
        rsvpModal.style.display = "block";
    }
}

function closeRSVPModal() {
    rsvpModal.style.display = "none";
}

// Handle RSVP Form Submission
modalForm.addEventListener("rsvp-submit", (e) => {
    e.preventDefault();
    const userName = userNameInput.value.trim();
    const userEmail = userEmailInput.value.trim();

    if (!userName || !userEmail) {
        alert("Please fill in all fields.");
        return;
    }

    alert(`Thank you, ${userName}! You have reserved a seat for the event.`);
    closeRSVPModal();
});

// Event Listeners
viewInGridButton.addEventListener("click", () => {
    eventsContainer.classList.remove("hidden");
    calendarContainer.classList.add("hidden");
    renderGridView();
});

viewInCalendarButton.addEventListener("click", () => {
    calendarContainer.classList.remove("hidden");
    eventsContainer.classList.add("hidden");
    renderCalendarView();
});

modalCloseButton.addEventListener("click", closeRSVPModal);
window.addEventListener("click", (e) => {
    if (e.target === rsvpModal) {
        closeRSVPModal();
    }
});

// Initial Load
renderGridView();
