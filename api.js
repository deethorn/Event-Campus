const BASE_URL = 'http://localhost:3000';

const API = {
    async login(credentials) {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async registerUser(userData) {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }
        return response.json();
    },

    async getEvents() {
        const response = await fetch(`${BASE_URL}/api/events`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch events');
        }
        return response.json();
    },

    async createEvent(eventData) {
        const response = await fetch(`${BASE_URL}/api/events`, {
            method: 'POST',
            body: eventData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create event');
        }
        return response.json();
    },

    async deleteEvent(eventId) {
        const response = await fetch(`${BASE_URL}/api/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete event');
        }
        return response.json();
    },

    async rsvpToEvent(eventId) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            throw new Error('Must be logged in to RSVP');
        }

        const response = await fetch(`${BASE_URL}/api/events/${eventId}/rsvp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user.id })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to RSVP');
        }
        return response.json();
    },

    async getUserRSVPs() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            throw new Error('Must be logged in to view RSVPs');
        }

        const response = await fetch(`${BASE_URL}/api/users/${user.id}/rsvps`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch RSVPs');
        }
        return response.json();
    }
};

window.API = API;
