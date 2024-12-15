const rsvpModal = document.getElementById("rsvp-modal");
const modalCloseButton = document.getElementById("modal-close");
const rsvpForm = document.getElementById("rsvp-form");

async function handleRSVP(eventId) {
    try {
        const response = await API.registerForEvent(eventId);
        alert('Successfully registered for event!');
        closeRSVPModal();
        await fetchEvents(); // Refresh events list
    } catch (error) {
        console.error('RSVP error:', error);
        alert('Failed to register for event');
    }
}

rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const eventId = rsvpModal.dataset.eventId;
    await handleRSVP(eventId);
});

modalCloseButton.addEventListener("click", closeRSVPModal);

function closeRSVPModal() {
    rsvpModal.style.display = "none";
}