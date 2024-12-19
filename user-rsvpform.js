const rsvpModal = document.getElementById("rsvp-modal");
const modalCloseButton = document.getElementById("modal-close");
const rsvpForm = document.getElementById("rsvp-form");

async function handleRSVP(eventId) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please log in to RSVP');
            window.location.href = 'login.html';
            return;
        }

        // Check if already RSVP'd
        const response = await fetch(`${BASE_URL}/api/events/${eventId}/rsvp-status/${user.id}`);
        const status = await response.json();

        if (status.isRegistered) {
            alert('You have already RSVP\'d to this event');
            return;
        }

        await API.rsvpToEvent(eventId);
        alert('Successfully RSVP\'d to event!');
        closeRSVPModal();
        if (typeof loadEvents === 'function') {
            loadEvents();
        }
    } catch (error) {
        console.error('RSVP error:', error);
        alert(error.message);
    }
}

rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const eventId = rsvpModal.dataset.eventId;
    await handleRSVP(eventId);
});

modalCloseButton.addEventListener("click", closeRSVPModal);

function closeRSVPModal() {
    if (rsvpModal) {
        rsvpModal.style.display = "none";
    }
}

// Add this to handle image errors
function handleImageError(img) {
    img.onerror = null; // Prevent infinite loop
    img.src = '/images/default-event.jpg';
}