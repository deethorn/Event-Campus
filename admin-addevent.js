// Get form element
const addEventForm = document.getElementById("add-event-form");

// Handle form submission
addEventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Create FormData object
    const formData = new FormData();
    
    // Add form fields to FormData
    formData.append('name', document.getElementById('event-name').value);
    formData.append('date', document.getElementById('event-date').value);
    formData.append('location', document.getElementById('event-location').value);
    formData.append('description', document.getElementById('event-description').value);
    formData.append('speaker', document.getElementById('event-speaker').value);
    formData.append('seats_available', document.getElementById('event-seats').value);
    formData.append('category', document.getElementById('event-category').value);

    // Add cover image if one was selected
    const coverImage = document.getElementById('event-cover-image').files[0];
    if (coverImage) {
        formData.append('cover_image', coverImage);
    }

    try {
        const response = await fetch('http://localhost:3000/api/events', {
            method: 'POST',
            body: formData // Don't set Content-Type header - browser will set it with boundary
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create event');
        }

        alert('Event added successfully!');
        addEventForm.reset();
        // Refresh the events list
        if (typeof loadEvents === 'function') {
            await loadEvents();
        }
    } catch (error) {
        console.error('Error adding event:', error);
        alert('Error adding event: ' + error.message);
    }
});