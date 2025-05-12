
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const { checkMaturity } = require('./scripts/roiCheckLogic');
const withdrawalRoutes = require('./routes/withdrawalRoutes')(io, users);

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/uploads', express.static('uploads')); // ✅ Serve uploads

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Cron job
cron.schedule('0 0 * * *', () => {
  checkMaturity(); // runs every day at midnight
});

// Create server and socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const users = new Map();

io.on('connection', socket => {
  console.log('New client connected:', socket.id);

  socket.on('register', userId => {
    users.set(userId, socket.id);
  });

  socket.on('send_message', data => {
    const { senderId, receiverId, text } = data;
    const receiverSocketId = users.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', {
        senderId, text, timestamp: Date.now()
      });
    }

    const Message = require('./models/Message');
    Message.create({ sender: senderId, receiver: receiverId, text });
  });

  // ✅ Fix typing events inside socket connection
  socket.on('typing', ({ from, to }) => {
    const receiverSocketId = users.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', { from });
    }
  });

  socket.on('stop_typing', ({ from, to }) => {
    const receiverSocketId = users.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('stop_typing', { from });
    }
  });

  socket.on('disconnect', () => {
    for (let [userId, id] of users.entries()) {
      if (id === socket.id) users.delete(userId);
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
