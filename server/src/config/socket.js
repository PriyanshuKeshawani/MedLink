const { Server } = require('socket.io');

let io;
const userSockets = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (userId) => {
      userSockets.set(userId, socket.id);
      socket.userId = userId;
      console.log(`User ${userId} associated with socket ${socket.id}`);
      // Notify other active peers that this user is now online
      io.emit('peer-status', { userId, online: true });
    });

    socket.on('check-peer-online', ({ peerId }) => {
      const isOnline = userSockets.has(peerId);
      socket.emit('peer-status', { userId: peerId, online: isOnline });
    });

    socket.on('p2p-signal', ({ recipientId, signalData }) => {
      const recipientSocketId = userSockets.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('p2p-signal', {
          senderId: socket.userId,
          signalData
        });
      } else {
        socket.emit('p2p-signal-failed', { recipientId, reason: 'peer_offline' });
      }
    });

    socket.on('disconnect', () => {
      let disconnectedUserId = null;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          break;
        }
      }
      console.log('User disconnected:', socket.id);
      if (disconnectedUserId) {
        // Notify active peers that this user is now offline
        io.emit('peer-status', { userId: disconnectedUserId, online: false });
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

const getUserSocket = (userId) => {
  return userSockets.get(userId);
};

module.exports = { initSocket, getIO, getUserSocket, userSockets };
