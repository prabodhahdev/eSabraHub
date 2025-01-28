import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext'; // Adjust the path as needed
import './ChatDisplay.css'
const ChatDisplay = ({ conversation, onSendMessage }) => {
  const { authState } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chat/${conversation._id}/messages`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (conversation) {
      fetchMessages();
    }
  }, [conversation, authState.token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        const senderId = authState.user._id; // Assuming userId is available in authState
        const receiverId = conversation.participants.find(id => id !== senderId); // Assuming conversation contains participants' IDs
        
        const response = await axios.post('http://localhost:5000/api/chat/send', {
          senderId,
          receiverId,
          message,
          conversationId: conversation._id
        }, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        // Update messages state locally
        setMessages([...messages, response.data]);
        setMessage('');
        // Notify parent component to update messages
        onSendMessage(response.data);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-display-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === authState.user._id ? 'sent' : 'received'}`}
          >
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatDisplay;
