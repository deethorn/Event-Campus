require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Initialize Express
const app = express();
app.use(bodyParser.json());

// Set up PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false, // Allows self-signed certificates
  },
});

// Test Database Connection
(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database successfully!');
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
})();

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Event Management System!');
});

// Create Event (POST)
app.post('/events', async (req, res) => {
  const { name, date, location, description, speaker, seatsAvailable, category, coverImage } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO events (name, date, location, description, speaker, seats_available, category, cover_image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, date, location, description, speaker, seatsAvailable, category, coverImage]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create event' });
  }
});

// Get All Events (GET)
app.get('/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to fetch events' });
  }
});

// Get Single Event (GET)
app.get('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (result.rows.length) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to fetch event' });
  }
});

// Update Event (PUT)
app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date, location, description, speaker, seatsAvailable, category, coverImage } = req.body;
  try {
    const result = await pool.query(
      `UPDATE events 
       SET name = $1, date = $2, location = $3, description = $4, speaker = $5, 
           seats_available = $6, category = $7, cover_image = $8 
       WHERE id = $9 RETURNING *`,
      [name, date, location, description, speaker, seatsAvailable, category, coverImage, id]
    );
    if (result.rows.length) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update event' });
  }
});

// Delete Event (DELETE)
app.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length) {
      res.json({ message: 'Event deleted successfully' });
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to delete event' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
