const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Message = require('../models/Message');
const User = require('../models/User');

// Send message
router.post('/', auth, async (req, res) => {
  const { receiverId, text } = req.body;
  const message = await Message.create({
    sender: req.user.id,
    receiver: receiverId,
    text
  });
  res.json(message);
});

// Get all messages between user and admin
router.get('/:receiverId', auth, async (req, res) => {
  const { receiverId } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: receiverId },
      { sender: receiverId, receiver: req.user.id }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});

module.exports = router;
const upload = require('../utils/upload');

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  const file = req.file;
  const { receiverId } = req.body;

  const message = await Message.create({
    sender: req.user.id,
    receiver: receiverId,
    fileUrl: `/uploads/${file.filename}`,
    fileType: file.mimetype
  });

  res.json(message);
});

