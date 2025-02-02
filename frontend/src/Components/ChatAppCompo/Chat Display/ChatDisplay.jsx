import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';
import './ChatDisplay.css';

const ChatDisplay = ({ conversation, onSendMessage }) => {
  const { authState } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  useEffect(()=>{
    const fetchUsers=async()=>{

    }
  },[])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chat/${conversation._id}/messages`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setMessages(response.data);
        console.log(setMessage)
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
        const senderId = authState.user._id; 
        const receiverId = conversation.participants.find(id => id !== senderId); 
        
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

        console.log('Response from server:', response.data); // Debugging line
        setMessages(prevMessages => [...prevMessages, response.data]);
        setMessage('');
        onSendMessage(response.data);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-display-container-chat">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === authState.user._id ? 'sent' : 'received'}`}
          >
            <p>{msg.message}</p>
            
            <span className="time-stamp">{new Date(msg.createdAt).toLocaleTimeString()}</span> {/* Timestamp */}          </div>
        ))}
        <div ref={messagesEndRef} />
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
