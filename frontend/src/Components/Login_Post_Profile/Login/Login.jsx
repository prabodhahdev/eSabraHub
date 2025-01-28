import React, { useState } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './Login.css';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false); // Added loading state
  const { authState, login, signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      if (isSignup) {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords don't match");
          setLoading(false); // Stop loading
          return;
        }
        if (!validateEmail(formData.email)) {
          toast.error("Invalid email format");
          setLoading(false); // Stop loading
          return;
        }
        await signup(formData.username, formData.email, formData.password);
        toast.success("Signup successful");
      } else {
        if (!validateEmail(formData.email)) {
          toast.error("Invalid email format");
          setLoading(false); // Stop loading
          return;
        }
        await login(formData.email, formData.password);
        toast.success("Login successful");
      }

      // Log user details
      console.log('User:', authState.user);
      console.log('User Email:', authState.user?.email); // Optional chaining
      console.log('User ID:', authState.user?.id);
      console.log('Token:', authState.token);

      // Reset form data after successful login or signup
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      
      navigate('/posts'); // Redirect to the /posts page after successful login or signup

    } catch (error) {
      toast.error(error.message || "Invalid Credentials"); // Display specific error message
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  const setIsSignupFun = () => {
    setIsSignup(true);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const setLogin = () => {
    setIsSignup(false);
    setFormData({
      email: '',
      password: '',
    });
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        {isSignup && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        {isSignup && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
        </button>
        <div className="login-bottom-part">
          {isSignup ? (
            <p>
              Already have an account? 
              <span onClick={setLogin}> Login here</span>
            </p>
          ) : (
            <p>
              Create an account? 
              <span onClick={setIsSignupFun}> Click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
