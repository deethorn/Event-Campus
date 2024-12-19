// DOM Elements
const profilePic = document.getElementById("profile-pic");
const displayName = document.getElementById("admin-name");
const logoutBtn = document.getElementById("logout-btn");
const eventsTable = document.querySelector('#events-table tbody');
const editProfileBtn = document.getElementById("edit-profile-btn");
const editProfileModal = document.getElementById("edit-profile-modal");
const closeModal = document.getElementById("close-modal");
const newAdminName = document.getElementById("new-admin-name");
const newProfilePic = document.getElementById("new-profile-pic");
const saveProfileBtn = document.getElementById("save-profile-btn");

const DEFAULT_PROFILE_IMAGE = 'images/default-profile.jpg';
const BACKEND_URL = 'http://localhost:3000';

// Load Admin Profile
function loadAdminProfile() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            window.location.href = 'login.html';
            return;
        }
        
        // Update display name
        displayName.textContent = user.name || "Admin";
            
        // Update profile picture
        if (user.photo && user.photo !== 'undefined') {
            // Check if photo is a full URL or a path
            const photoUrl = user.photo.startsWith('http') 
                ? user.photo 
                : `${BACKEND_URL}${user.photo}`;
            profilePic.src = photoUrl;
        } else {
            profilePic.src = DEFAULT_PROFILE_IMAGE;
        }

        // Add error handling for image load
        profilePic.onerror = function() {
            console.log('Failed to load profile image, using default');
            this.onerror = null; // Prevent infinite loop
            this.src = DEFAULT_PROFILE_IMAGE;
        };
}

  catch (error) {
    console.error('Error loading user data:', error);
    profilePic.src = DEFAULT_PROFILE_IMAGE;
    displayName.textContent = "Admin";
}
}


// Handle Logout
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('profile-pic');
        window.location.href = 'login.html';
    });
}

// Function to load events
async function loadEvents() {
    try {
        const response = await fetch('http://localhost:3000/api/events');
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const events = await response.json();
        renderEvents(events);
    } catch (error) {
        console.error('Error loading events:', error);
        alert('Failed to load events');
    }
}

// Render events in table
function renderEvents(events) {
    if (!eventsTable) return;
    eventsTable.innerHTML = '';

    events.forEach(event => {
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
            <td>
                <img src="${event.cover_image ? `http://localhost:3000${event.cover_image}` : '/images/default-event.jpg'}" 
                     alt="${event.name}" 
                     style="width: 50px; height: 50px; object-fit: cover;">
            </td>
            <td>
                <button onclick="deleteEvent(${event.id})" class="delete-btn">Delete</button>
            </td>
        `;
        eventsTable.appendChild(row);
    });
}

// Delete event function
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    try {
        await API.deleteEvent(eventId);
        alert('Event deleted successfully');
        loadEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event: ' + error.message);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadAdminProfile();
    loadEvents();
});