const Conversation = require('../models/Conversation.model');
const Message = require('../models/Message.model');
const User = require('../models/User.model');

// @desc    Lấy tất cả cuộc trò chuyện của user
// @route   GET /api/v1/chat/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'firstName lastName avatar')
    .sort({ updatedAt: -1 });

    // Format lại data để trả về
    const result = conversations.map(conv => {
      const otherParticipant = conv.participants.find(
        p => p._id.toString() !== userId
      );
      
      return {
        _id: conv._id,
        participant: otherParticipant,
        lastMessage: conv.lastMessage,
        updatedAt: conv.updatedAt
      };
    });

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Lấy tin nhắn của một cuộc trò chuyện
// @route   GET /api/v1/chat/conversations/:conversationId/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'firstName lastName avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Tạo cuộc trò chuyện mới hoặc lấy cuộc trò chuyện hiện tại
// @route   POST /api/v1/chat/conversations
// @access  Private
exports.createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;

    // Kiểm tra xem đã có cuộc trò chuyện giữa 2 người chưa
    let conversation = await Conversation.findOne({
      participants: { 
        $all: [userId, participantId] 
      }
    }).populate('participants', 'firstName lastName avatar');

    if (!conversation) {
      // Tạo cuộc trò chuyện mới
      conversation = await Conversation.create({
        participants: [userId, participantId]
      });
      
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'firstName lastName avatar');
    }

    const otherParticipant = conversation.participants.find(
      p => p._id.toString() !== userId
    );

    res.status(201).json({
      success: true,
      data: {
        _id: conversation._id,
        participant: otherParticipant,
        lastMessage: conversation.lastMessage,
        updatedAt: conversation.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Gửi tin nhắn mới
// @route   POST /api/v1/chat/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content, type = 'text' } = req.body;
    const senderId = req.user.id;

    // Tạo tin nhắn mới
    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      content,
      type
    });

    // Cập nhật cuộc trò chuyện
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      updatedAt: Date.now()
    });

    // Populate sender info
    await message.populate('sender', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Đánh dấu tin nhắn đã đọc
// @route   PUT /api/v1/chat/messages/:messageId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndUpdate(messageId, { isRead: true });

    res.status(200).json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Tìm kiếm user để chat
// @route   GET /api/v1/chat/users
// @access  Private
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    const users = await User.find({
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user.id }
    }).select('firstName lastName email avatar');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};