import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext'; // Adjust the path as needed
import './ChatList.css';

const ChatList = ({ onSelectConversation, newMessage }) => {
  const { authState } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null); // State for selected chat

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chat/list', {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        console.log("Conversations fetched:", response.data); // Log conversations data
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
  }, [authState.token]);

  useEffect(() => {
    if (newMessage) {
      const updateConversationList = (updatedConversation) => {
        setConversations((prevConversations) => {
          const filteredConversations = prevConversations.filter(
            (conversation) => conversation._id !== updatedConversation._id
          );
          return [updatedConversation, ...filteredConversations];
        });
      };

      updateConversationList(newMessage.conversation);
    }
  }, [newMessage]);

  const getProfileImageUrl = (imagePath) => {
    const url = imagePath ? `http://localhost:5000${imagePath}` : '/uploads/profiles/profile.jpg';
    console.log("Generated Profile Image URL:", url); // Log the generated URL
    return url;
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
            onError={(e) => {
              console.error("Error loading image for:", authState.user.username, "URL:", e.target.src);
              e.target.src = '/uploads/profiles/profile.jpg'; // Fallback image
            }}
          />
        </div>
        <div className="chatlist-user-content">
          <p className='chat-user-auth-name'>{authState.user.username}</p>
        </div>
      </div>
      {conversations.map(conversation => (
        <div
          key={conversation._id}
          className={`chatlist-user ${selectedChatId === conversation._id ? 'selected-chat' : ''}`} // Add conditional class
          onClick={() => {
            setSelectedChatId(conversation._id); // Set selected chat ID
            onSelectConversation(conversation); // Call parent function
          }}
        >
          <div className="chatlist-middle">
            {conversation.participants
              .filter(participant => participant._id !== authState.user._id)
              .map(participant => (
                <div key={participant._id} className="chatlist-participant">
                  <div className="chatlist-user-img">
                    <img
                      src={getProfileImageUrl(participant.profileImage)}
                      alt={participant.username}
                      onError={(e) => {
                        console.error("Error loading image for participant:", participant.username, "URL:", e.target.src);
                        e.target.src = '/uploads/profiles/profile.jpg'; // Fallback image
                      }}
                    />
                  </div>
                  <div className="chatlist-user-content">
                    <p>{participant.username}</p>
                    <p className='text-msg'>{conversation.lastMessage?.message || 'No messages yet'}</p>
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
