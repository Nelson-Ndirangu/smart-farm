// src/components/chat/ChatList.jsx
import React, { useState, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { chatAPI } from '../../services/ChatAPI';

const ChatList = ({ onSelectChat }) => {
  const { chats, setChats, onlineUsers, loading } = useChat();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getChats();
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.participants.some(participant => 
      participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    chat.consultation?.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatLastMessage = (chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const message = chat.lastMessage.content;
    return message.length > 30 ? message.substring(0, 30) + '...' : message;
  };

  const getOtherParticipant = (chat) => {
    const { user } = useAuth();
    return chat.participants.find(p => p._id !== user._id);
  };

  const isOnline = (participant) => {
    return onlineUsers.has(participant._id);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-3 p-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {filteredChats.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-3">💬</div>
            <p className="text-gray-500">No chats yet</p>
            <p className="text-sm text-gray-400 mt-1">Start a conversation from a consultation</p>
          </div>
        ) : (
          filteredChats.map(chat => {
            const otherParticipant = getOtherParticipant(chat);
            
            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer transition duration-150"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">👨‍🌾</span>
                  </div>
                  {isOnline(otherParticipant) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {otherParticipant?.name}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate">
                    {formatLastMessage(chat)}
                  </p>
                  
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {chat.consultation?.topic}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;