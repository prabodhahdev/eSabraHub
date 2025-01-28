import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/HomePageCompo/NavBar/NavBar';
import HomePage from './Pages/HomePage';
import LoginSignupPage from './Pages/LoginSignupPage';
import ChatPage from './Pages/ChatPage';
import PostPage from './Pages/PostPage';

// Services pages
import Accommodation from './Pages/Services/Accomodation';
import AttractivePlacesPage from './Pages/Services/AttractivePlacesPage';
import FoodsPage from './Pages/Services/FoodsPage';
import MedicinePage from './Pages/Services/MedicinePage';
import TransportPage from './Pages/Services/TransportPage';
import AboutUs from './Components/HomePageCompo/AboutUs/AboutUs';
import Footer from './Components/HomePageCompo/Footer/Footer';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'; 
import { AuthProvider } from './Context/AuthContext'; 
import Profile from './Components/Login_Post_Profile/Profile/Profile';
import ProfilePage from './Pages/ProfilePage';
import ServiceDetails from './Components/ServicesCompo/ServiceDetails/ServiceDetails';
import ChatDisplay from './Components/ChatAppCompo/Chat Display/ChatDisplay';
import Chatbot from './Pages/Chatbot/Chatbot';

function App() {
  return (
    <AuthProvider> {/* Wrap your application with AuthProvider */}
      <Router>
        <div className="App">
          <NavBar />
          <div className='main-content'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginSignupPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/chat/:userId" element={<ChatPage />} />
                <Route path="/chat/:conversationId" element={<ChatDisplay />} />
                <Route path="/posts" element={<PostPage />} />
              </Route>

              {/* Unprotected routes */}
              <Route path="/accommodation" element={<Accommodation />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/food" element={<FoodsPage />} />
              <Route path="/medicine" element={<MedicinePage />} />
              <Route path="/places" element={<AttractivePlacesPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/details/:id" element={<ServiceDetails />} />

            </Routes>
            <Chatbot/>
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
