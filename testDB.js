require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        // Test database connection
        const client = await pool.connect();
        console.log('Successfully connected to the database');

        // Test query
        const result = await client.query('SELECT NOW()');
        console.log('Database time:', result.rows[0].now);

        // Check tables
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('\nExisting tables:');
        tables.rows.forEach(table => {
            console.log(table.table_name);
        });

        client.release();
    } catch (err) {
        console.error('Database connection error:', err);
    } finally {
        await pool.end();
    }
}

testConnection();