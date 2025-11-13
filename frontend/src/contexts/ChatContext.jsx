// src/contexts/ChatContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatAPI } from '../services/ChatAPI';
import { socketService } from '../services/socket';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      socketService.connect();
      socketService.joinUser(user._id);

      // Set up socket event listeners
      socketService.on('newMessage', handleNewMessage);
      socketService.on('userTyping', handleUserTyping);
      socketService.on('userOnline', handleUserOnline);
      socketService.on('userOffline', handleUserOffline);
      socketService.on('messageDelivered', handleMessageDelivered);

      // Load initial chats
      fetchChats();
      fetchUnreadCount();

      return () => {
        // Clean up socket listeners
        socketService.off('newMessage', handleNewMessage);
        socketService.off('userTyping', handleUserTyping);
        socketService.off('userOnline', handleUserOnline);
        socketService.off('userOffline', handleUserOffline);
        socketService.off('messageDelivered', handleMessageDelivered);
        
        socketService.disconnect();
      };
    }
  }, [user]);

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
    
    // Update chats list with new last message
    setChats(prev => prev.map(chat => 
      chat._id === message.chatId 
        ? { ...chat, lastMessage: message, updatedAt: new Date() }
        : chat
    ));

    // Update unread count
    if (message.sender._id !== user._id) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const handleUserTyping = (data) => {
    if (data.isTyping) {
      setTypingUsers(prev => new Set(prev).add(data.userId));
    } else {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    }
  };

  const handleUserOnline = (userId) => {
    setOnlineUsers(prev => new Set(prev).add(userId));
  };

  const handleUserOffline = (userId) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  const handleMessageDelivered = (data) => {
    // Update message delivery status if needed
    console.log('Message delivered:', data);
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChats();
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await chatAPI.getUnreadCount();
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await chatAPI.getChat(chatId);
      setMessages(response.data.messages || []);
      
      // Mark messages as read
      await chatAPI.markAsRead(chatId);
      
      // Update unread count
      fetchUnreadCount();
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  };

  const sendMessage = async (chatId, content, messageType = 'text', fileUrl = null) => {
    try {
      const messageData = {
        content,
        messageType,
        fileUrl
      };

      const response = await chatAPI.sendMessage(chatId, messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const joinChat = (chatId) => {
    socketService.joinChat(chatId);
  };

  const leaveChat = (chatId) => {
    socketService.leaveChat(chatId);
  };

  const sendTypingIndicator = (chatId, isTyping) => {
    socketService.sendTyping(chatId, isTyping);
  };

  const createChatForConsultation = async (consultationId) => {
    try {
      const response = await chatAPI.getOrCreateChat(consultationId);
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  };

  const value = {
    // State
    chats,
    activeChat,
    messages,
    onlineUsers,
    typingUsers,
    loading,
    unreadCount,
    
    // Setters
    setActiveChat,
    setMessages,
    setLoading,
    
    // Actions
    fetchChats,
    fetchChatMessages,
    sendMessage,
    joinChat,
    leaveChat,
    sendTypingIndicator,
    createChatForConsultation,
    refreshUnreadCount: fetchUnreadCount,
    
    // Socket status
    isSocketConnected: socketService.getConnectionStatus(),
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};