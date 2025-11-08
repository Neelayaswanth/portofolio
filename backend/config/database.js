const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✓ PostgreSQL database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('✗ Error connecting to PostgreSQL database:', error.message);
    return false;
  }
}

// Initialize database tables
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Read and execute schema
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await client.query(schema);
    console.log('✓ Database tables initialized');
    
    client.release();
  } catch (error) {
    console.error('✗ Error initializing database:', error.message);
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection,
  initializeDatabase
};
