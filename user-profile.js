// DOM Elements
const profilePic = document.getElementById("profile-pic");
const displayName = document.getElementById("user-name");
const editProfileBtn = document.getElementById("edit-profile-btn");
const editProfileModal = document.getElementById("edit-profile-modal");
const closeModal = document.getElementById("close-modal");
const newUserName = document.getElementById("new-user-name");
const newProfilePic = document.getElementById("new-profile-pic");
const saveProfileBtn = document.getElementById("save-profile-btn");

// Load Admin Data (Static or From Local Storage)
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem("userData")) || {
        name: "User",
        photo: "default-profile.jpg",
    };
    displayName.textContent = userData.name;
    profilePic.src = userData.photo;
}

// Save Admin Data to Local Storage
function saveUserData(name, photo) {
    const userData = { name, photo };
    localStorage.setItem("userData", JSON.stringify(userData));
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
    const updatedName = newUserName.value || displayName.textContent;
    const updatedPhoto = newProfilePic.files[0];

    if (updatedPhoto) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePic.src = e.target.result;
            saveUserData(updatedName, e.target.result);
            displayName.textContent = updatedName;
        };
        reader.readAsDataURL(updatedPhoto);
    } else {
        saveUserData(updatedName, profilePic.src);
        displayName.textContent = updatedName;
    }

    editProfileModal.style.display = "none";
});

// Initialize
loadUserData();


