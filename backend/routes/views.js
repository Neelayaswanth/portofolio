const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Track profile view
router.post('/', async (req, res) => {
  try {
    // Better IP address extraction - check multiple sources
    let ipAddress = req.ip;
    
    // If behind proxy, check X-Forwarded-For header
    if (!ipAddress || ipAddress === '::1' || ipAddress === '127.0.0.1') {
      const forwardedFor = req.get('x-forwarded-for');
      if (forwardedFor) {
        // Take the first IP in the chain
        ipAddress = forwardedFor.split(',')[0].trim();
      } else {
        // Fall back to connection remote address
        ipAddress = req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown';
      }
    }
    
    // Normalize IPv6 localhost to IPv4
    if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') {
      ipAddress = '127.0.0.1';
    }
    
    const userAgent = req.get('user-agent') || 'unknown';
    const referrer = req.get('referer') || req.body.referrer || 'direct';
    const sessionId = req.body.session_id || req.sessionID || 'unknown';
    
    // For localhost/unknown IP, use session_id for unique visitor identification
    // because all local requests will have the same IP (127.0.0.1)
    // For production with real public IPs, we use IP address
    const isLocalhostOrUnknown = ipAddress === 'unknown' || 
                                 ipAddress === '127.0.0.1' || 
                                 ipAddress === '::1' || 
                                 ipAddress.startsWith('::ffff:127.0.0.1');
    
    // Use session_id as unique identifier for localhost/unknown, otherwise use IP
    const uniqueVisitorId = isLocalhostOrUnknown ? `session_${sessionId}` : ipAddress;

    console.log(`Tracking view - IP: ${ipAddress}, Visitor ID: ${uniqueVisitorId}, Session: ${sessionId.substring(0, 20)}...`);

    // Insert profile view (always use actual IP for logging)
    await pool.query(
      `INSERT INTO profile_views (ip_address, user_agent, referrer, session_id) 
       VALUES ($1, $2, $3, $4)`,
      [ipAddress, userAgent, referrer, sessionId]
    );

    // Update or insert visitor using unique visitor identifier
    // For localhost: use session_id, for production: use IP address
    const visitorResult = await pool.query(
      `SELECT id, visit_count FROM visitors WHERE ip_address = $1`,
      [uniqueVisitorId]
    );

    if (visitorResult.rows.length > 0) {
      // Update existing visitor
      await pool.query(
        `UPDATE visitors 
         SET visit_count = visit_count + 1, 
             last_visit = CURRENT_TIMESTAMP,
             user_agent = $1,
             referrer = $2
         WHERE ip_address = $3`,
        [userAgent, referrer, uniqueVisitorId]
      );
      console.log(`✓ Updated visitor: ${uniqueVisitorId} (visits: ${visitorResult.rows[0].visit_count + 1})`);
    } else {
      // Insert new visitor
      await pool.query(
        `INSERT INTO visitors (ip_address, user_agent, referrer) 
         VALUES ($1, $2, $3)`,
        [uniqueVisitorId, userAgent, referrer]
      );
      console.log(`✓ New visitor created: ${uniqueVisitorId}`);
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
    const uniqueCheckResult = await pool.query(
      `SELECT COUNT(DISTINCT ip_address) as unique_count 
       FROM profile_views 
       WHERE DATE(viewed_at) = $1`,
      [today]
    );

    if (uniqueCheckResult.rows[0].unique_count > 0) {
      await pool.query(
        `UPDATE analytics 
         SET unique_visitors = $1 
         WHERE date = $2`,
        [uniqueCheckResult.rows[0].unique_count, today]
      );
    }

    res.json({
      success: true,
      message: 'View tracked successfully',
      visitor_id: uniqueVisitorId
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to track view',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get total views count
router.get('/count', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as total FROM profile_views'
    );

    res.json({
      success: true,
      count: parseInt(result.rows[0].total)
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
    const result = await pool.query(
      'SELECT COUNT(*) as total FROM visitors'
    );

    res.json({
      success: true,
      count: parseInt(result.rows[0].total)
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
    
    const analyticsResult = await pool.query(
      `SELECT date, total_views, unique_visitors, messages_received 
       FROM analytics 
       WHERE date >= CURRENT_DATE - INTERVAL '1 day' * $1
       ORDER BY date DESC`,
      [days]
    );

    // Get total stats
    const totalViewsResult = await pool.query(
      'SELECT COUNT(*) as total FROM profile_views'
    );
    const uniqueVisitorsResult = await pool.query(
      'SELECT COUNT(*) as total FROM visitors'
    );
    const totalMessagesResult = await pool.query(
      'SELECT COUNT(*) as total FROM messages'
    );

    res.json({
      success: true,
      analytics: analyticsResult.rows,
      totals: {
        views: parseInt(totalViewsResult.rows[0].total),
        visitors: parseInt(uniqueVisitorsResult.rows[0].total),
        messages: parseInt(totalMessagesResult.rows[0].total)
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

