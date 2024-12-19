require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initializeDB() {
    try {
        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'user'
            );
        `);

        // Create events table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                location VARCHAR(255) NOT NULL,
                description TEXT,
                speaker VARCHAR(255),
                seats_available INTEGER NOT NULL,
                category VARCHAR(50) NOT NULL,
                cover_image VARCHAR(255)
            );
        `);

        // Create RSVP table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS rsvp (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                event_id INTEGER REFERENCES events(id),
                rsvp_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(20) DEFAULT 'confirmed',
                UNIQUE(user_id, event_id)
            );
        `);

        // Create test users
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        // Insert admin user if not exists
        await pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
        `, ['Admin User', 'admin@example.com', hashedPassword, 'admin']);

        // Insert regular user if not exists
        await pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
        `, ['Regular User', 'user@example.com', hashedPassword, 'user']);

        console.log('Database initialized successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await pool.end();
    }
}

initializeDB(); 