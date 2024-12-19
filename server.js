require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Initialize Express
const app = express();

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database configuration
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
pool.connect((err, client, done) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Successfully connected to database');
        done();
    }
});

// Make sure you have these directories created
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Make sure the uploads directory is served
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Add this after your other middleware
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Test route
app.get('/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            message: 'Server is working',
            dbTime: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Database connection failed',
            details: error.message
        });
    }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        console.log('Login attempt:', { email, role });

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND role = $2',
            [email, role]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Database error during login' });
    }
});

// Register route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role]
        );

        const token = jwt.sign(
            { userId: result.rows[0].id, role: result.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Database error during registration' });
    }
});

// Events routes
app.get('/api/events', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events ORDER BY date DESC');
        console.log('Events fetched:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Database error fetching events' });
    }
});

app.post('/api/events', upload.single('cover_image'), async (req, res) => {
    try {
        const { name, date, location, description, speaker, seats_available, category } = req.body;
        
        // Validate required fields
        if (!name || !date || !location || !seats_available || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const cover_image = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await pool.query(
            `INSERT INTO events (name, date, location, description, speaker, seats_available, category, cover_image)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, date, location, description, speaker, seats_available, category, cover_image]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: error.message || 'Database error creating event' });
    }
});

// RSVP route
app.post('/api/events/:eventId/rsvp', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.body;

        // Check if event exists and has available seats
        const eventResult = await pool.query(
            'SELECT * FROM events WHERE id = $1',
            [eventId]
        );

        if (eventResult.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const event = eventResult.rows[0];
        if (event.seats_available <= 0) {
            return res.status(400).json({ error: 'No seats available' });
        }

        // Create RSVP record
        await pool.query(
            'INSERT INTO rsvp (user_id, event_id) VALUES ($1, $2)',
            [userId, eventId]
        );

        // Decrease available seats
        await pool.query(
            'UPDATE events SET seats_available = seats_available - 1 WHERE id = $1',
            [eventId]
        );

        res.json({ message: 'RSVP successful' });
    } catch (error) {
        if (error.constraint === 'rsvp_user_id_event_id_key') {
            res.status(400).json({ error: 'Already RSVP\'d to this event' });
        } else {
            console.error('RSVP error:', error);
            res.status(500).json({ error: 'Failed to RSVP' });
        }
    }
});

// Add this new route to check RSVP status
app.get('/api/events/:eventId/rsvp-status/:userId', async (req, res) => {
    try {
        const { eventId, userId } = req.params;
        
        const result = await pool.query(
            'SELECT * FROM rsvp WHERE event_id = $1 AND user_id = $2',
            [eventId, userId]
        );
        
        res.json({ 
            isRegistered: result.rows.length > 0,
            rsvpDetails: result.rows[0] || null
        });
    } catch (error) {
        console.error('Error checking RSVP status:', error);
        res.status(500).json({ error: 'Failed to check RSVP status' });
    }
});

// Add this new route to get user's RSVPs
app.get('/api/users/:userId/rsvps', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const result = await pool.query(`
            SELECT e.*, r.rsvp_date 
            FROM events e 
            JOIN rsvp r ON e.id = r.event_id 
            WHERE r.user_id = $1 
            ORDER BY r.rsvp_date DESC`,
            [userId]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching user RSVPs:', error);
        res.status(500).json({ error: 'Failed to fetch RSVPs' });
    }
});

// Add this with your other routes
app.delete('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // First check if event exists
        const eventExists = await pool.query(
            'SELECT * FROM events WHERE id = $1',
            [id]
        );

        if (eventExists.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Delete associated RSVPs first (due to foreign key constraint)
        await pool.query(
            'DELETE FROM rsvp WHERE event_id = $1',
            [id]
        );

        // Then delete the event
        await pool.query(
            'DELETE FROM events WHERE id = $1',
            [id]
        );

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('CORS enabled for all origins');
});