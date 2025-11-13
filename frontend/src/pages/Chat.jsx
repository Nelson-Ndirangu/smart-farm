// src/pages/Chat.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChatList from '../components/ui/ChatList';
import ChatWindow from '../components/ui/chat/ChatWindow';

const Chat = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Please log in to access chat</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Chat with {user.role === 'farmer' ? 'agronomists' : 'farmers'} about your consultations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List - Hidden on mobile when chat is open */}
          <div className={`lg:col-span-1 ${activeChat ? 'hidden lg:block' : 'block'}`}>
            <ChatList onSelectChat={setActiveChat} />
          </div>

          {/* Chat Window */}
          <div className={`lg:col-span-3 ${activeChat ? 'block' : 'hidden lg:block'}`}>
            {activeChat ? (
              <ChatWindow chat={activeChat} />
            ) : (
              <div className="h-full bg-white rounded-lg shadow-sm border flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat</h3>
                  <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;