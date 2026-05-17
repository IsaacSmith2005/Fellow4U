const express = require('express');
const { 
  getConversations, 
  getMessages, 
  createConversation, 
  sendMessage,
  markAsRead,
  searchUsers
} = require('../controllers/chat.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Tất cả routes chat đều cần đăng nhập
router.use(protect);

// Conversations
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);

// Messages
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/messages', sendMessage);
router.put('/messages/:messageId/read', markAsRead);

// Search users
router.get('/users', searchUsers);

module.exports = router;