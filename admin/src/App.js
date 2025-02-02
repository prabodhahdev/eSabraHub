import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation
import NavBar from './Components/NavBar/NavBar'; // Adjust the path as necessary
import { ToastContainer } from 'react-toastify'; // Import toast here
import 'react-toastify/dist/ReactToastify.css';

// Import Pages
import AttractivePlaces from './pages/AttractivePlaces';
import Accomodation from './pages/Accomodation';
import Foods from './pages/Foods';
import Medicine from './pages/Medicine';
import Transport from './pages/Transport';
import Main from './pages/Main';
import EditService from './Components/EditService/EditService';
import Login from './pages/Login'; // Import login page

function App() {
  const location = useLocation(); // Get the current route

  return (
    <div className='app-container'>
      {/* Conditionally render NavBar based on the current route */}
      {location.pathname !== '/' && <NavBar />}  {/* Hide NavBar on '/login' */}

      <div className='app-admin'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/accommodation" element={<Accomodation />} />
          <Route path="/food-shop" element={<Foods />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/medical-centers" element={<Medicine />} />
          <Route path="/attractive-places" element={<AttractivePlaces />} />
          <Route path="/edit/:id" element={<EditService />} /> {/* Edit page route */}
          <Route path="/main" element={<Main />} />
        </Routes>
      </div>

      <ToastContainer 
        className="toast-container" 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
}

export default App;
