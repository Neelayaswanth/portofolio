const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Store a new message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Insert message into database
    const [result] = await pool.query(
      `INSERT INTO messages (name, email, subject, message) 
       VALUES (?, ?, ?, ?)`,
      [name, email, subject || 'No Subject', message]
    );

    // Update analytics
    const today = new Date().toISOString().split('T')[0];
    await pool.query(
      `INSERT INTO analytics (date, messages_received) 
       VALUES (?, 1) 
       ON DUPLICATE KEY UPDATE 
       messages_received = messages_received + 1`,
      [today]
    );

    res.json({
      success: true,
      message: 'Message sent successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// Get all messages (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const [messages] = await pool.query(
      `SELECT id, name, email, subject, message, created_at, read_status 
       FROM messages 
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// Get message count
router.get('/count', async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT COUNT(*) as total FROM messages'
    );

    res.json({
      success: true,
      count: result[0].total
    });
  } catch (error) {
    console.error('Error fetching message count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message count'
    });
  }
});

// Mark message as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'UPDATE messages SET read_status = TRUE WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message'
    });
  }
});

// Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'DELETE FROM messages WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

module.exports = router;

