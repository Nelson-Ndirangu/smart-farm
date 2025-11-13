// src/services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventCallbacks = new Map();
  }

  connect() {
    if (this.socket) {
      return this.socket;
    }

    const SOCKET_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      this.triggerEvent('connect', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.triggerEvent('disconnect', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.triggerEvent('connect_error', error);
    });

    this.socket.on('newMessage', (message) => {
      this.triggerEvent('newMessage', message);
    });

    this.socket.on('userTyping', (data) => {
      this.triggerEvent('userTyping', data);
    });

    this.socket.on('userOnline', (userId) => {
      this.triggerEvent('userOnline', userId);
    });

    this.socket.on('userOffline', (userId) => {
      this.triggerEvent('userOffline', userId);
    });

    this.socket.on('messageDelivered', (data) => {
      this.triggerEvent('messageDelivered', data);
    });

    this.socket.on('messageRead', (data) => {
      this.triggerEvent('messageRead', data);
    });
  }

  // Join a chat room
  joinChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinChat', chatId);
    }
  }

  // Leave a chat room
  leaveChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leaveChat', chatId);
    }
  }

  // Join with user ID
  joinUser(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join', userId);
    }
  }

  // Send typing indicator
  sendTyping(chatId, isTyping) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { chatId, isTyping });
    }
  }

  // Notify message delivery
  notifyMessageDelivered(chatId, messageId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('messageDelivered', { chatId, messageId });
    }
  }

  // Register event callback
  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event).push(callback);
  }

  // Remove event callback
  off(event, callback) {
    if (this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Trigger event callbacks
  triggerEvent(event, data) {
    if (this.eventCallbacks.has(event)) {
      this.eventCallbacks.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventCallbacks.clear();
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }
}

// Create a singleton instance
export const socketService = new SocketService();