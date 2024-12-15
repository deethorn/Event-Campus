// DOM Elements
const profilePic = document.getElementById("profile-pic");
const displayName = document.getElementById("admin-name");
const editProfileBtn = document.getElementById("edit-profile-btn");
const editProfileModal = document.getElementById("edit-profile-modal");
const closeModal = document.getElementById("close-modal");
const newAdminName = document.getElementById("new-admin-name");
const newProfilePic = document.getElementById("new-profile-pic");
const saveProfileBtn = document.getElementById("save-profile-btn");
const logoutBtn = document.getElementById("logout-btn");

// Load Admin Profile
function loadAdminProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    displayName.textContent = user.name;
    // Use stored profile pic if available, otherwise use default
    const storedProfilePic = localStorage.getItem('profilePic');
    if (storedProfilePic) {
        profilePic.src = storedProfilePic;
    }
}

// Open Edit Profile Modal
editProfileBtn.addEventListener("click", () => {
    editProfileModal.style.display = "block";
});

// Close Edit Profile Modal
closeModal.addEventListener("click", () => {
    editProfileModal.style.display = "none";
});

// Save Profile Changes
saveProfileBtn.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const updatedName = newAdminName.value || user.name;
    const updatedPhoto = newProfilePic.files[0];

    if (updatedPhoto) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePic.src = e.target.result;
            localStorage.setItem('profilePic', e.target.result);
            
            // Update user data
            user.name = updatedName;
            localStorage.setItem('user', JSON.stringify(user));
            displayName.textContent = updatedName;
        };
        reader.readAsDataURL(updatedPhoto);
    } else {
        // Update only name
        user.name = updatedName;
        localStorage.setItem('user', JSON.stringify(user));
        displayName.textContent = updatedName;
    }

    editProfileModal.style.display = "none";
});

// Handle Logout
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profilePic');
    window.location.href = 'login.html';
});

// Close modal when clicking outside
window.addEventListener("click", (event) => {
    if (event.target === editProfileModal) {
        editProfileModal.style.display = "none";
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAdminProfile();
});

// Check authentication on every page load
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token || user.role !== 'admin') {
        window.location.href = 'login.html';
    }
}

// Run auth check when page loads
checkAuth();