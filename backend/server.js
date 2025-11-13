// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./configs/db');
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const subscriptionRoutes = require('../backend/routes/subsciptionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const auth = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((errorHandler));

// 404 handler
app.use((auth));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/chat', chatRoutes);

// MongoDB connection
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their user ID
  socket.on('join', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined with socket ${socket.id}`);
    
    // Notify others that this user is online
    socket.broadcast.emit('userOnline', userId);
  });

  // Join specific chat room
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.userId} joined chat ${chatId}`);
  });

  // Leave chat room
  socket.on('leaveChat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.userId} left chat ${chatId}`);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('userTyping', {
      userId: socket.userId,
      isTyping: data.isTyping
    });
  });

  // Handle message delivery status
  socket.on('messageDelivered', (data) => {
    socket.to(data.chatId).emit('messageDelivered', {
      messageId: data.messageId,
      deliveredTo: socket.userId
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      // Notify others that this user went offline
      socket.broadcast.emit('userOffline', socket.userId);
    }
  });
});

// Make io accessible to routes
app.set('io', io);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Farm API is running!' });
});



const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;