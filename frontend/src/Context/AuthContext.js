// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import Toastify for notifications

// Create the AuthContext
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: localStorage.getItem('token') || null,
  });

  // Validate token on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/users/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Token validation response:", response.data); // Log the response for debugging
          setAuthState({ user: response.data.user, token });
        } catch (error) {
          console.error('Token validation failed:', error.response?.data || error.message);
          localStorage.removeItem('token');
          setAuthState({ user: null, token: null });
        }
      }
    };

    initializeAuth();
  }, []);

  // Set the Authorization header for Axios requests
  useEffect(() => {
    if (authState.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authState.token]);

  // Login method
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      setAuthState({ user: response.data.user, token: response.data.token });
      localStorage.setItem('token', response.data.token);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      throw new Error(errorMessage);
    }
  };

  // Signup method
  const signup = async (username, email, password, confirmPassword) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', { username, email, password, confirmPassword });
      setAuthState({ user: response.data.user, token: response.data.token });
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      throw new Error(errorMessage);
    }
  };

  // Logout method
  const logout = () => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
