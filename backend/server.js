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
const subscriptionRoutes = require('./routes/subsciptionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');
const app = express();

// MongoDB connection
connectDB();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'https://smart-farm-bay.vercel.app/',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/chat', chatRoutes);

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup (improved CORS)
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://smart-farm-bay.vercel.app/",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["*"]
  }
});

// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User:  ', socket.id, ' is connected to the server' );

  // User joins with their user ID
  socket.on('join', (userId) => {
    if (!userId) return;
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined with socket ${socket.id}`);
    socket.broadcast.emit('userOnline', userId);
  });

  // Join specific chat room
  socket.on('joinChat', (chatId) => {
    if (!chatId) return;
    socket.join(chatId);
    console.log(`User ${socket.userId} joined chat ${chatId}`);
  });

  // Leave chat room
  socket.on('leaveChat', (chatId) => {
    if (!chatId) return;
    socket.leave(chatId);
    console.log(`User ${socket.userId} left chat ${chatId}`);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    if (!data || !data.chatId) return;
    socket.to(data.chatId).emit('userTyping', {
      userId: socket.userId,
      isTyping: data.isTyping
    });
  });

  // Handle message delivery status
  socket.on('messageDelivered', (data) => {
    if (!data || !data.chatId) return;
    socket.to(data.chatId).emit('messageDelivered', {
      messageId: data.messageId,
      deliveredTo: socket.userId
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
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

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
