import React from 'react';
import { useParams } from 'react-router-dom'; 
import OthersProfile from '../Components/Login_Post_Profile/Profile/OthersProfiles';
import CreatePostNavBar from '../Components/PostsPageCompo/CreatePostnavBar/CreatePostNavBar';
import OtherProfileMiddle from '../Components/Login_Post_Profile/Profile/OtherProfileMiddle';
import './ProfilePage.css'
const OthersProfilePage = () => {
  const { userId } = useParams(); // Extract userId from the URL

  return (
    <div>
      <CreatePostNavBar />
     
      <div className="profilePage-container-three-parts">
        <div className="profilepage-leftpane">
        <OthersProfile userId={userId} />  
        </div>
        <div className="profilepage-middlepage">
        <OtherProfileMiddle userId={userId} /> 
        </div>
        <div className="profilepage-rightpage">

        </div>
      </div>
    </div>
  );
};

export default OthersProfilePage;
