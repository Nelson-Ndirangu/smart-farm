// src/services/chatApi.js
import api from './api';

export const chatAPI = {
  // Get all chats for current user
  getChats: () => api.get('/api/chat'),
  
  // Get specific chat with messages
  getChat: (chatId) => api.get(`/api/chat/${chatId}`),
  
  // Get or create chat for a consultation
  getOrCreateChat: (consultationId) => api.post(`/api/chat/consultation/${consultationId}`),
  
  // Send a new message
  sendMessage: (chatId, messageData) => api.post(`/api/chat/${chatId}/messages`, messageData),
  
  // Mark messages as read
  markAsRead: (chatId) => api.patch(`/api/chat/${chatId}/messages/read`),
  
  // Upload file for chat (if you implement file sharing)
  uploadFile: (chatId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(`/api/chat/${chatId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Delete a message (optional feature)
  deleteMessage: (chatId, messageId) => api.delete(`/api/chat/${chatId}/messages/${messageId}`),
  
  // Get unread message count
  getUnreadCount: () => api.get('/api/chat/unread/count'),
  
  // Search messages in a chat
  searchMessages: (chatId, query) => api.get(`/api/chat/${chatId}/search?q=${encodeURIComponent(query)}`),
};

export default chatAPI;