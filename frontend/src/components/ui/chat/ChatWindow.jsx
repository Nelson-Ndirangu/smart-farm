// src/components/chat/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../../contexts/ChatContext';
import { useAuth } from '../../../contexts/AuthContext';
import { chatAPI } from '../../../services/ChatAPI';

const ChatWindow = ({ chat }) => {
  const { user } = useAuth();
  const { messages, setMessages, socket, typingUsers, sendTypingIndicator } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const otherParticipant = chat.participants.find(p => p._id !== user._id);

  useEffect(() => {
    if (chat) {
      fetchMessages();
      socket?.emit('joinChat', chat._id);
    }

    return () => {
      if (chat) {
        socket?.emit('leaveChat', chat._id);
      }
    };
  }, [chat?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getChat(chat._id);
      setMessages(response.data.messages || []);
      
      // Mark messages as read
      await chatAPI.markAsRead(chat._id);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        content: newMessage.trim(),
        messageType: 'text'
      };

      await chatAPI.sendMessage(chat._id, messageData);
      setNewMessage('');
      setIsTyping(false);
      sendTypingIndicator(chat._id, false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(chat._id, true);
    }

    // Clear previous timeout
    if (window.typingTimeout) {
      clearTimeout(window.typingTimeout);
    }

    // Set new timeout
    window.typingTimeout = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(chat._id, false);
    }, 1000);
  };

  const isUserTyping = () => {
    const typingUserIds = Array.from(typingUsers);
    return typingUserIds.some(id => id !== user._id);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-lg">👨‍🌾</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{otherParticipant?.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{otherParticipant?.role}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{chat.consultation?.topic}</p>
            <p className="text-xs text-gray-500">
              ${(chat.consultation?.price / 100).toFixed(2)} • {chat.consultation?.status}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-3">💬</div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Start the conversation</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender._id === user._id
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-white text-gray-900 border rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender._id === user._id ? 'text-green-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isUserTyping() && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg rounded-bl-none px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;