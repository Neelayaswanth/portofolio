/**
 * Quick fix script to add missing columns to profile_views table
 * Run: node fix-columns.js
 */

require('dotenv').config();
const { pool } = require('./config/database');

async function fixColumns() {
  let client;
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    
    console.log('Checking for missing columns...');
    
    // Check and add referrer column
    const checkReferrer = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'profile_views' AND column_name = 'referrer'
    `);
    
    if (checkReferrer.rows.length === 0) {
      console.log('Adding referrer column...');
      await client.query('ALTER TABLE profile_views ADD COLUMN referrer TEXT');
      console.log('✓ Added referrer column to profile_views');
    } else {
      console.log('✓ referrer column already exists');
    }
    
    // Check and add session_id column
    const checkSessionId = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'profile_views' AND column_name = 'session_id'
    `);
    
    if (checkSessionId.rows.length === 0) {
      console.log('Adding session_id column...');
      await client.query('ALTER TABLE profile_views ADD COLUMN session_id VARCHAR(255)');
      console.log('✓ Added session_id column to profile_views');
    } else {
      console.log('✓ session_id column already exists');
    }
    
    // Verify columns
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'profile_views'
      ORDER BY ordinal_position
    `);
    
    console.log('\nProfile_views table columns:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    console.log('\n✓ Database fix completed successfully!');
    
    client.release();
    process.exit(0);
  } catch (error) {
    if (client) {
      client.release();
    }
    console.error('✗ Error fixing database:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

fixColumns();

