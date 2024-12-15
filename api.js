// Mock data storage with some initial data
const mockData = {
    events: [
        {
            id: 1,
            name: "Sample Event",
            date: "2024-03-20",
            location: "Main Hall",
            description: "A sample event description",
            speaker: "John Doe",
            seats_available: 100,
            category: "workshops",
            cover_image: "default-event-image.jpg"
        }
    ],
    users: [
        {
            id: 1,
            name: "Admin User",
            email: "admin@example.com",
            password: "admin123",
            role: "admin"
        },
        {
            id: 2,
            name: "Regular User",
            email: "user@example.com", 
            password: "user123",
            role: "user"
        }
    ]
};

// Create API object with our functions
const API = {
    login(credentials) {
        const user = mockData.users.find(u => 
            u.email === credentials.email && 
            u.password === credentials.password &&
            u.role === credentials.role
        );
        if (user) {
            return {
                token: 'mock_token',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            };
        }
        throw new Error('Invalid credentials');
    },

    registerUser(userData) {
        const newUser = {
            id: mockData.users.length + 1,
            ...userData
        };
        mockData.users.push(newUser);
        return {
            token: 'mock_token',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        };
    },

    getEvents() {
        return mockData.events;
    },

    createEvent(eventData) {
        const newEvent = {
            id: mockData.events.length + 1,
            ...eventData
        };
        mockData.events.push(newEvent);
        return newEvent;
    },

    deleteEvent(eventId) {
        mockData.events = mockData.events.filter(event => event.id !== parseInt(eventId));
        return { success: true };
    },

    updateEvent(eventData) {
        const eventIndex = mockData.events.findIndex(e => e.id === eventData.id);
        if (eventIndex !== -1) {
            mockData.events[eventIndex] = { ...mockData.events[eventIndex], ...eventData };
            return mockData.events[eventIndex];
        }
        throw new Error('Event not found');
    }
};

// Make API available globally
window.API = API;
