import React, { useState, useEffect } from 'react';
import './Hero.css';
import hand from '../../../Assets/hand_icon.png'

const words = ["University Students", "Staff", " Villagers"];

const Hero = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingInterval, setTypingInterval] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentIndex = loopNum % words.length;
      const fullText = words[currentIndex];

      if (isDeleting) {
        setCurrentWord((prev) => fullText.substring(0, prev.length - 1));
        setTypingInterval(100);
      } else {
        setCurrentWord((prev) => fullText.substring(0, prev.length + 1));
        setTypingInterval(150);
      }

      if (!isDeleting && currentWord === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentWord === '') {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingInterval);

    return () => clearTimeout(timer);
  }, [currentWord, isDeleting, typingInterval, loopNum]);

  return (
    <div className='hero' id='heroId'>
      <div className="leftSide-hero">
      <div className="welcomeText">
        <h2>Hey </h2>
        <img src={hand} alt="" />
      </div>
      
      <h1>Connecting <span className="dynamic-word">{currentWord}</span></h1>
<p className='welcomtextpara'>eSabraHub connects university students, staff, and local villagers.
  <br /> Discover detailed accommodation options, reliable transport services, <br />
  attractive places, nearby medical centers, and the best food shops. 
  <br />Share posts and engage in real-time chat with our vibrant community.
  <br /> Join us and experience the convenience of eSabraHub!</p>

  <button>Join With Us</button>
      </div>
    </div>
  );
};

export default Hero;
