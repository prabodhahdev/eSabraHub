import React, { useState } from 'react';
import ChatList from '../Components/ChatAppCompo/ChatList/ChatList'; // Adjust the path as needed
import ChatDisplay from '../Components/ChatAppCompo/Chat Display/ChatDisplay'; // Ensure this path is correct
import DefaultChatDisplay from '../Components/ChatAppCompo/DefaultChatDisplay/DefaultChatDisplay'; // Adjust the path as needed
import './PagesCSS/ChatPage.css';

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (message) => {
    // Logic to handle message sending (optional)
    console.log('Message sent:', message);
  };

  return (
    <div className="chat-page-container">
      <ChatList onSelectConversation={handleSelectConversation} />

      <div className="chat-display-container">
        {selectedConversation ? (
          <ChatDisplay
            conversation={selectedConversation}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <DefaultChatDisplay />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
