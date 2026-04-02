const express = require('express');
const router = express.Router();
const { getMessages, markAsRead, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// All message routes are protected
router.use(protect);

// POST /api/messages           - Send a message to a doctor
// GET  /api/messages           - Get all messages (with ?isRead=true/false)
router.route('/').post(sendMessage).get(getMessages);

// PUT /api/messages/:id/read   - Mark message as read
router.put('/:id/read', markAsRead);

module.exports = router;
