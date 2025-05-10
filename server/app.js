
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*', // or your frontend domain
    methods: ['GET', 'POST']
  }
});

app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/withdrawals', require('./routes/withdrawalRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
const cron = require('node-cron');
const { checkMaturity } = require('./scripts/roiCheckLogic');

cron.schedule('0 0 * * *', () => {
  checkMaturity(); // runs every day at midnight
});
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
const users = new Map();

io.on('connection', socket => {
  console.log('New client connected:', socket.id);

  socket.on('register', userId => {
    users.set(userId, socket.id);
  });

  socket.on('send_message', data => {
    const { senderId, receiverId, text } = data;

    // Emit to receiver if online
    const receiverSocketId = users.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', {
        senderId, text, timestamp: Date.now()
      });
    }

    // Optionally store in DB (optional)
    const Message = require('./models/Message');
    Message.create({ sender: senderId, receiver: receiverId, text });
  });

  socket.on('disconnect', () => {
    for (let [userId, id] of users.entries()) {
      if (id === socket.id) users.delete(userId);
    }
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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
  app.use('/uploads', express.static('uploads'));

  









