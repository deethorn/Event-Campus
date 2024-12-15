// testAuth.js
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

async function testAuth() {
    try {
        // Test user creation
        const hashedPassword = await bcrypt.hash('testpassword', 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            ['Test User', 'test@example.com', hashedPassword, 'user']
        );
        
        console.log('Test user created:', result.rows[0]);

        // Test user login
        const user = await pool.query('SELECT * FROM users WHERE email = $1', ['test@example.com']);
        const validPassword = await bcrypt.compare('testpassword', user.rows[0].password);
        
        console.log('Password valid:', validPassword);

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await pool.end();
    }
}

testAuth();