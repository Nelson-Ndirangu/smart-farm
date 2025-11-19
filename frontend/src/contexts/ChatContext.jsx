// src/contexts/ChatContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { chatAPI } from '../services/ChatAPI';
import { socketService } from '../services/socket';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
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
  const socketRef = useRef(null);

  useEffect(() => {
    // initialize socket once
    const socket = socketService.connect();
    socketRef.current = socket;

    // When user becomes available, identify user to server
    if (user) {
      socketService.joinUser(user._id);
    }

    // Register listeners
    const onConnect = (id) => {
      console.log('chatcontext: socket connected', id);
      // join user again in case of reconnection
      if (user) socketService.joinUser(user._id);
    };

    const onNewMessage = (message) => {
      // if the message belongs to the currently open chat append it
      setMessages(prev => {
        // avoid duplicates
        if (prev.some(m => String(m._id) === String(message._id))) return prev;
        return [...prev, message];
      });

      // update chat list lastMessage
      setChats(prev => prev.map(c => c._id === String(message.chat) || c._id === String(message.chatId) ? { ...c, lastMessage: message, updatedAt: new Date() } : c));
      // update unread count if message from someone else
      if (message.sender && message.sender._id !== user?._id) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const onUserTyping = (data) => {
      setTypingUsers(prev => {
        const s = new Set(prev);
        if (data.isTyping) s.add(data.userId);
        else s.delete(data.userId);
        return s;
      });
    };

    const onUserOnline = (userId) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
    };

    const onUserOffline = (userId) => {
      setOnlineUsers(prev => {
        const s = new Set(prev);
        s.delete(userId);
        return s;
      });
    };

    const onDisconnect = () => {
      console.log('chatcontext: socket disconnected');
    };

    socketService.on('connect', onConnect);
    socketService.on('newMessage', onNewMessage);
    socketService.on('userTyping', onUserTyping);
    socketService.on('userOnline', onUserOnline);
    socketService.on('userOffline', onUserOffline);
    socketService.on('disconnect', onDisconnect);

    // load initial chats if user
    if (user) {
      fetchChats();
      fetchUnreadCount();
    }

    return () => {
      socketService.off('connect', onConnect);
      socketService.off('newMessage', onNewMessage);
      socketService.off('userTyping', onUserTyping);
      socketService.off('userOnline', onUserOnline);
      socketService.off('userOffline', onUserOffline);
      socketService.off('disconnect', onDisconnect);

      // Do not fully disconnect socket here if other parts of app still need it.
      // Only clear event callbacks we registered above.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await chatAPI.getChats();
      // API returns array of chats
      const results = Array.isArray(res.data) ? res.data : res.data?.chats || [];
      setChats(results);
    } catch (err) {
      console.error('fetchChats error', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await chatAPI.getUnreadCount();
      setUnreadCount(res.data?.count || 0);
    } catch (err) {
      console.error('fetchUnreadCount error', err);
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const res = await chatAPI.getChat(chatId);
      const msgs = res.data.messages || [];
      setMessages(msgs);
      await chatAPI.markAsRead(chatId);
      fetchUnreadCount();
      setActiveChat(chats.find(c => String(c._id) === String(chatId)) || null);
    } catch (err) {
      console.error('fetchChatMessages', err);
      throw err;
    }
  };

  const sendMessage = async (chatId, content, messageType = 'text', fileUrl = null) => {
    try {
      const messageData = { content, messageType, fileUrl };
      const res = await chatAPI.sendMessage(chatId, messageData);
      // server emits newMessage; but optimistic update for speed:
      // setMessages(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error('sendMessage error', err);
      throw err;
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

  const value = {
    chats,
    activeChat,
    messages,
    onlineUsers,
    typingUsers,
    loading,
    unreadCount,
    setActiveChat,
    setMessages,
    setLoading,
    fetchChats,
    fetchChatMessages,
    sendMessage,
    joinChat,
    leaveChat,
    sendTypingIndicator,
    isSocketConnected: socketService.getConnectionStatus(),
    socket: socketRef.current // direct socket for components that need it
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
