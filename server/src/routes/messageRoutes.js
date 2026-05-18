const express = require('express');
const { 
  sendMessage, 
  getConversationHistory, 
  updateMessageStatus 
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all message routes

router.post('/', sendMessage);
router.get('/history/:partnerId', getConversationHistory);
router.patch('/:id/status', updateMessageStatus);

module.exports = router;
