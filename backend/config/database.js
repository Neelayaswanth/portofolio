const { Pool } = require('pg');
require('dotenv').config();

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('✗ Error: DATABASE_URL environment variable is not set!');
  console.error('  Please create a .env file with:');
  console.error('  DATABASE_URL=postgresql://username:password@host:port/database_name');
  console.error('  Example: DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/portfolio_db');
  process.exit(1);
}

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1') 
    ? false 
    : {
        rejectUnauthorized: false
      }
});

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    // Test query
    await client.query('SELECT NOW()');
    console.log('✓ PostgreSQL database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('✗ Error connecting to PostgreSQL database:');
    console.error('  Message:', error.message);
    console.error('  Code:', error.code);
    if (error.code === 'ECONNREFUSED') {
      console.error('  Hint: Make sure PostgreSQL is running and DATABASE_URL is correct');
    } else if (error.code === 'ENOTFOUND') {
      console.error('  Hint: Check your DATABASE_URL hostname');
    } else if (error.code === '3D000') {
      console.error('  Hint: Database does not exist. Create it first.');
    } else if (error.code === '28P01') {
      console.error('  Hint: Authentication failed. Check your username and password.');
    }
    return false;
  }
}

// Initialize database tables
async function initializeDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log('✓ Database connection established');
    
    // Read and execute schema
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    // Process line by line to handle multi-line statements
    const lines = schema.split('\n');
    const statements = [];
    let currentStatement = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines
      if (!trimmed) {
        continue;
      }
      
      // Skip comment-only lines
      if (trimmed.startsWith('--')) {
        continue;
      }
      
      // Remove inline comments (simple approach - may not handle all cases)
      let sqlLine = trimmed;
      const commentIndex = trimmed.indexOf('--');
      if (commentIndex > 0) {
        sqlLine = trimmed.substring(0, commentIndex).trim();
      }
      
      if (!sqlLine) {
        continue;
      }
      
      // Add to current statement
      currentStatement += (currentStatement ? ' ' : '') + sqlLine;
      
      // If line ends with semicolon, we have a complete statement
      if (sqlLine.endsWith(';')) {
        const stmt = currentStatement.trim();
        if (stmt.length > 0) {
          statements.push(stmt);
        }
        currentStatement = '';
      }
    }
    
    // Add any remaining statement (shouldn't happen with proper SQL, but just in case)
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }
    
    console.log(`  Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    let successCount = 0;
    let skippedCount = 0;
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await client.query(statement);
          successCount++;
        } catch (stmtError) {
          // Ignore "already exists" errors for tables/indexes (42P07 = relation already exists, 42710 = duplicate object)
          if (stmtError.code === '42P07' || stmtError.code === '42710') {
            skippedCount++;
            // Don't log - too verbose
          } else {
            console.error(`✗ Error executing statement ${i + 1}/${statements.length}:`, stmtError.message);
            console.error('  Code:', stmtError.code);
            console.error('  Statement:', statement.substring(0, 200) + (statement.length > 200 ? '...' : ''));
            throw stmtError;
          }
        }
      }
    }
    
    if (successCount > 0) {
      console.log(`  ✓ ${successCount} statement(s) executed successfully`);
    }
    if (skippedCount > 0) {
      console.log(`  ℹ ${skippedCount} table(s)/index(es) already exist`);
    }
    
    // Add missing columns to existing tables (migration)
    console.log('  Checking for missing columns...');
    try {
      // Check and add referrer column to profile_views
      const checkReferrer = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'profile_views' AND column_name = 'referrer'
      `);
      if (checkReferrer.rows.length === 0) {
        await client.query('ALTER TABLE profile_views ADD COLUMN referrer TEXT');
        console.log('  ✓ Added referrer column to profile_views');
      }
      
      // Check and add session_id column to profile_views
      const checkSessionId = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'profile_views' AND column_name = 'session_id'
      `);
      if (checkSessionId.rows.length === 0) {
        await client.query('ALTER TABLE profile_views ADD COLUMN session_id VARCHAR(255)');
        console.log('  ✓ Added session_id column to profile_views');
      }
    } catch (migrationError) {
      console.error('  ⚠ Error adding missing columns:', migrationError.message);
      // Don't throw - tables might already be correct
    }
    
    console.log('✓ Database tables initialized');
    
    client.release();
  } catch (error) {
    if (client) {
      client.release();
    }
    console.error('✗ Error initializing database:');
    console.error('  Message:', error.message);
    console.error('  Code:', error.code);
    if (error.detail) {
      console.error('  Detail:', error.detail);
    }
    if (error.hint) {
      console.error('  Hint:', error.hint);
    }
    // Don't throw - allow server to start even if tables already exist
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection,
  initializeDatabase
};
