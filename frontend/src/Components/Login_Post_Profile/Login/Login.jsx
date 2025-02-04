import React, { useState } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { toast } from 'react-toastify'; // Import Toastify for notifications

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const { authState, login, signup } = useAuth();
  const navigate = useNavigate();

  // Password validation pattern
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPasswordValid(passwordPattern.test(value));
      setPasswordTooShort(value.length < 8);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        // Password confirmation check
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords don't match");
          return;
        }
        // Password validation check
        if (!passwordValid) {
          alert(
            'Password must be at least 8 characters long and include a mix of uppercase and lowercase letters, numbers, and special characters.'
          );
          return;
        }
        // Call signup function with all required fields
        await signup(
          formData.username,
          formData.email,
          formData.password,
          formData.confirmPassword
        );
        toast.success('Signup successful');
      } else {
        // Call login function
        await login(formData.email, formData.password);
        toast.success('Login successful');
      }

      // Navigate to posts page after successful login/signup
      navigate('/posts');
    } catch (error) {
      toast.error('Invalid Credentials');
    }
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
        {passwordTooShort && (
          <p className="password-message">
            Password must be at least 8 characters long.
          </p>
        )}
        {!passwordValid && !passwordTooShort && (
          <p className="password-message">
            Use a mix of uppercase and lowercase letters, numbers, and special characters.
          </p>
        )}
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
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        <div className="login-bottom-part">
          {isSignup ? (
            <p>
              Already have an account? 
              <span onClick={() => setIsSignup(false)}> Login here</span>
            </p>
          ) : (
            <p>
              Create an account? 
              <span onClick={() => setIsSignup(true)}> Click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;