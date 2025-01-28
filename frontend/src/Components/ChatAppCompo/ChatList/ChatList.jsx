import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext'; // Adjust the path as needed
import './ChatList.css';

const ChatList = ({ onSelectConversation, newMessage }) => {
  const { authState } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chat/list', {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setConversations(response.data);
      } catch (error) {
        console.error('Failed to fetch chat list:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authState.token) {
      fetchChatList();
    }
  }, [authState.token]); // Only include authState.token as a dependency

  // Handle new message updates
  useEffect(() => {
    if (newMessage) {
      const updateConversationList = (updatedConversation) => {
        setConversations(prevConversations =>
          prevConversations.map(conversation =>
            conversation._id === updatedConversation._id ? updatedConversation : conversation
          )
        );
      };

      updateConversationList(newMessage.conversation);
    }
  }, [newMessage]); // Add newMessage as a dependency

  const getProfileImageUrl = (imagePath) => {
    return imagePath ? `http://localhost:5000${imagePath}` : '/uploads/profiles/profile.jpg';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chatlist-container">
  <div className="chatlist-top">
    <div className="chatlist-user-img">
      <img
        src={getProfileImageUrl(authState.user.profileImage)}
        alt={authState.user.username}
        onError={(e) => { e.target.src = '/uploads/profiles/profile.jpg'; }}
      />
    </div>
    <div className="chatlist-user-content">
      <p>{authState.user.username}</p>
    </div>
  </div>
  {conversations.map(conversation => (
    <div
      key={conversation._id}
      className="chatlist-user"
      onClick={() => onSelectConversation(conversation)} // Call the callback function
    >
      <div className="chatlist-middle">
        {conversation.participants
          .filter(participant => participant._id !== authState.user._id)
          .map(participant => (
            <div 
              key={participant._id} 
              className="chatlist-participant"
              onClick={() => onSelectConversation(conversation)} // Call the callback function
            >
              <div className="chatlist-user-img">
                <img
                  src={getProfileImageUrl(participant.profileImage)}
                  alt={participant.username}
                  onError={(e) => { e.target.src = '/uploads/profiles/profile.jpg'; }}
                />
              </div>
              <div className="chatlist-user-content">
                <p>{participant.username}</p>
                <p>{conversation.lastMessage?.message || 'No messages yet'}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  ))}
</div>

  );
};

export default ChatList;
