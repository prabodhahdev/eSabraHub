import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../../Context/AuthContext'; // Adjust the import path
import { ToastContainer } from 'react-toastify'; // For testing toast messages
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter for routing context
import Login from './Login'; // Adjust the import path
import React from 'react';

// Test case for showing error when passwords do not match during signup
test('shows error when passwords do not match during signup', async () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
        <ToastContainer /> {/* Add ToastContainer to display toast messages */}
      </AuthProvider>
    </MemoryRouter>
  );

  // Switch to signup form
  fireEvent.click(screen.getByText('Click here')); // Click to go to signup form

  // Enter form data with passwords not matching
  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testuser@gmail.com' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testuser123' } });
  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'testuser122' } });

  // Submit form
  fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

  // Wait for the toast to show and check if the message is displayed
  await waitFor(() => {
    expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
  });
});

// Test case for showing error when email format is invalid during signup
test('shows error when email format is invalid during signup', async () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
        <ToastContainer /> {/* Add ToastContainer to display toast messages */}
      </AuthProvider>
    </MemoryRouter>
  );

  // Switch to signup form
  fireEvent.click(screen.getByText('Click here')); // Click to go to signup form

  // Enter form data with invalid email
  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid-email' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testuser123' } });
  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'testuser123' } });

  // Submit form
  fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

  // Wait for the toast to show and check if the error message is displayed
  await waitFor(() => {
    expect(screen.getByText('Invalid email format')).toBeInTheDocument(); // Adjust the error message as needed
  });
});

/*
// Test case for valid signup with correct details
test('allows signup with valid details', async () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
        <ToastContainer />
      </AuthProvider>
    </MemoryRouter>
  );
/*
  // Switch to signup form
  fireEvent.click(screen.getByText('Click here')); // Click to go to signup form

  // Enter form data with valid details
  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testuser@gmail.com' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testuser123' } });
  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'testuser123' } });

  // Submit form
  fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

  // Wait for the success toast to appear using findByText
  const toastSuccessMessage = await screen.findByText(/signup successful/i); // Regex to match success message
  expect(toastSuccessMessage).toBeInTheDocument();
});

*/



// Test case for showing error when login credentials are invalid
test('shows error when login credentials are invalid', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
          <ToastContainer /> {/* Add ToastContainer to display toast messages */}
        </AuthProvider>
      </MemoryRouter>
    );
  
    // Enter invalid login credentials (incorrect email and password)
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid-email@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword123' } });
  
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  
    // Wait for the toast to show and check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument(); // Update the error message to match the one in your app
    });
  });


  // Test case for showing error when password is incorrect
test('shows error when password is incorrect', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
          <ToastContainer /> {/* Add ToastContainer to display toast messages */}
        </AuthProvider>
      </MemoryRouter>
    );
  
    // Enter a valid email but an incorrect password
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test2@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword123' } });
  
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  
    // Wait for the toast to show and check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument(); // Adjust the error message as needed
    });
  });


// Test case for valid login credentials
test('allows login with valid credentials', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
          <ToastContainer /> {/* Add ToastContainer to display toast messages */}
        </AuthProvider>
      </MemoryRouter>
    );
  
    // Enter valid email and password
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test2@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '222222' } });
  
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  
    // Wait for the success toast to show and check if the message is displayed
    await waitFor(() => {
      const toastSuccessMessage = screen.getByText(/login successful/i); // Regex to match success message
      expect(toastSuccessMessage).toBeInTheDocument();
    });
  });