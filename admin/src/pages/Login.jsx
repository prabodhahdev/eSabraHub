// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { toast } from 'react-toastify';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // To redirect after login

  const handleLogin = (e) => {
    e.preventDefault();

    // Check the login credentials
    if (email === 'admin@gmail.com' && password === 'admin') {
      // Store login status (in a real app, use a more secure method, like JWT or sessions)
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/main'); // Redirect to home after successful login
     toast.success('Loggin is Succuessfull!');
      
    } else {
      setError('Invalid email or password');
     toast.error('Invalid email or password');
      
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>ADMIN LOGIN</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email: </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Password: </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
