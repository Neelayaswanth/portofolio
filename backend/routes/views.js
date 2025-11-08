const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Track profile view
router.post('/', async (req, res) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';
    const referrer = req.get('referer') || req.body.referrer || 'direct';
    const sessionId = req.body.session_id || req.sessionID || 'unknown';

    // Insert profile view
    await pool.query(
      `INSERT INTO profile_views (ip_address, user_agent, referrer, session_id) 
       VALUES (?, ?, ?, ?)`,
      [ipAddress, userAgent, referrer, sessionId]
    );

    // Update or insert visitor
    const [visitor] = await pool.query(
      `SELECT id, visit_count FROM visitors WHERE ip_address = ?`,
      [ipAddress]
    );

    if (visitor.length > 0) {
      // Update existing visitor
      await pool.query(
        `UPDATE visitors 
         SET visit_count = visit_count + 1, 
             last_visit = CURRENT_TIMESTAMP,
             user_agent = ?,
             referrer = ?
         WHERE ip_address = ?`,
        [userAgent, referrer, ipAddress]
      );
    } else {
      // Insert new visitor
      await pool.query(
        `INSERT INTO visitors (ip_address, user_agent, referrer) 
         VALUES (?, ?, ?)`,
        [ipAddress, userAgent, referrer]
      );
    }

    // Update analytics
    const today = new Date().toISOString().split('T')[0];
    await pool.query(
      `INSERT INTO analytics (date, total_views)
      VALUES ($1, 1)
      ON CONFLICT (date) DO UPDATE SET
      total_views = analytics.total_views + 1`,
      [today]
    );

    // Check if unique visitor for today
    const [uniqueCheck] = await pool.query(
      `SELECT COUNT(DISTINCT ip_address) as unique_count 
       FROM profile_views 
       WHERE DATE(viewed_at) = ?`,
      [today]
    );

    if (uniqueCheck[0].unique_count > 0) {
      await pool.query(
        `UPDATE analytics 
         SET unique_visitors = ? 
         WHERE date = ?`,
        [uniqueCheck[0].unique_count, today]
      );
    }

    res.json({
      success: true,
      message: 'View tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track view'
    });
  }
});

// Get total views count
router.get('/count', async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT COUNT(*) as total FROM profile_views'
    );

    res.json({
      success: true,
      count: result[0].total
    });
  } catch (error) {
    console.error('Error fetching view count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch view count'
    });
  }
});

// Get unique visitors count
router.get('/visitors/count', async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT COUNT(*) as total FROM visitors'
    );

    res.json({
      success: true,
      count: result[0].total
    });
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visitor count'
    });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const [analytics] = await pool.query(
      `SELECT date, total_views, unique_visitors, messages_received 
       FROM analytics 
       WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       ORDER BY date DESC`,
      [days]
    );

    // Get total stats
    const [totalViews] = await pool.query(
      'SELECT COUNT(*) as total FROM profile_views'
    );
    const [uniqueVisitors] = await pool.query(
      'SELECT COUNT(*) as total FROM visitors'
    );
    const [totalMessages] = await pool.query(
      'SELECT COUNT(*) as total FROM messages'
    );

    res.json({
      success: true,
      analytics,
      totals: {
        views: totalViews[0].total,
        visitors: uniqueVisitors[0].total,
        messages: totalMessages[0].total
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

module.exports = router;

