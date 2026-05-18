const Message = require('../models/Message');
const { getUserSocket } = require('../config/socket');

const sendMessage = async (req, res) => {
  try {
    const { recipientId, text, deliveryMode } = req.body;
    const senderId = req.user.id;

    if (!recipientId || !text) {
      return res.status(400).json({ message: 'Recipient and message text are required.' });
    }

    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      text,
      deliveryMode: deliveryMode || 'db_delayed',
      status: 'sent'
    });

    // Populate sender details for UI
    const populated = await Message.findById(message._id)
      .populate('sender', 'firstName lastName avatar')
      .populate('recipient', 'firstName lastName avatar');

    // If recipient has active websocket connection, dispatch immediately (real-time hybrid backup!)
    const recipientSocketId = getUserSocket(recipientId);
    if (recipientSocketId) {
      const io = require('../config/socket').getIO();
      // Mark as delivered instantly since recipient is active online
      populated.status = 'delivered';
      await populated.save();
      
      io.to(recipientSocketId).emit('receive_message', populated);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversationHistory = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { partnerId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: partnerId },
        { sender: partnerId, recipient: senderId }
      ]
    })
    .populate('sender', 'firstName lastName avatar')
    .sort({ createdAt: 1 });

    // Mark received messages from this partner as read
    const unreadFromPartner = messages.filter(
      m => m.sender._id.toString() === partnerId && m.status !== 'read'
    );

    if (unreadFromPartner.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadFromPartner.map(m => m._id) } },
        { $set: { status: 'read' } }
      );
      
      // Dispatch read status update to partner's socket if active
      const partnerSocketId = getUserSocket(partnerId);
      if (partnerSocketId) {
        const io = require('../config/socket').getIO();
        io.to(partnerSocketId).emit('messages_read', {
          readerId: senderId,
          messageIds: unreadFromPartner.map(m => m._id)
        });
      }
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'delivered' or 'read'

    if (!['delivered', 'read'].includes(status)) {
      return res.status(400).json({ message: 'Invalid message status.' });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    // Only recipient can change status of received messages
    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You are not the recipient.' });
    }

    message.status = status;
    await message.save();

    // Trigger update to sender socket
    const senderSocketId = getUserSocket(message.sender);
    if (senderSocketId) {
      const io = require('../config/socket').getIO();
      io.to(senderSocketId).emit('message_status_updated', {
        messageId: message._id,
        status
      });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getConversationHistory,
  updateMessageStatus
};
