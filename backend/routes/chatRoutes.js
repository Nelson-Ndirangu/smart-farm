// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Chat = require('../models/Chat');
const Consultation = require('../models/consultation');

// Get all chats for a user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id,
      isActive: true
    })
      .populate('participants', 'name role profile')
      .populate('consultation', 'topic status price')
      
      .sort({ updatedAt: -1 })
      .lean();

    // manually attach lastMessage
    chats.forEach(chat => {
      if (chat.messages && chat.messages.length > 0) {
        chat.lastMessage = chat.messages[chat.messages.length - 1];
      }
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get specific chat
router.get('/:chatId', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name role profile')
      .populate('consultation', 'topic status price')
      .lean();

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // manually populate sender fields in messages
    await Chat.populate(chat, {
      path: "messages.sender",
      select: "name role profile"
    });

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get or create chat for consultation
router.post('/consultation/:consultationId', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.consultationId)
      .populate('farmer')
      .populate('agronomist');

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    if (consultation.farmer._id.toString() !== req.user.id &&
        consultation.agronomist._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let chat = await Chat.findOne({
      consultation: consultation._id,
      isActive: true
    });

    if (!chat) {
      chat = new Chat({
        consultation: consultation._id,
        participants: [consultation.farmer._id, consultation.agronomist._id],
        messages: []
      });
      await chat.save();
    }

    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name role profile')
      .populate('consultation', 'topic status price')
      .lean();

    res.json(populatedChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Send message
router.post('/:chatId/messages', auth, async (req, res) => {
  try {
    const { content, messageType = 'text', fileUrl } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.some(p => p.toString() === req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const message = {
      sender: req.user.id,
      content,
      messageType,
      fileUrl,
      readBy: [{ user: req.user.id }]
    };

    chat.messages.push(message);
    await chat.save();

    const populatedChat = await Chat.findById(chat._id).lean();
    await Chat.populate(populatedChat, {
      path: "messages.sender",
      select: "name role profile"
    });

    const newMessage =
      populatedChat.messages[populatedChat.messages.length - 1];

    req.app.get('io')
      .to(chat._id.toString())
      .emit('newMessage', newMessage);

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Mark as read
router.patch('/:chatId/messages/read', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    chat.messages.forEach(msg => {
      const exists = msg.readBy.some(r => r.user.toString() === req.user.id);
      if (!exists) {
        msg.readBy.push({ user: req.user.id });
      }
    });

    await chat.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
