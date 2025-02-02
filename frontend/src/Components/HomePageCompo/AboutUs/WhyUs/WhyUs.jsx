import React from 'react'
import './WhyUs.css'
import girl from '../../../../Assets/whyus-team.jpg'
import tick from '../../../../Assets/tick.png'

const WhyUs = () => {
  return (
    <div className='aboutus-whyus-container'>
      <div className="aboutus-whyus-image">
      <img src={girl} alt="" />
      </div>
      <div className="aboutus-whyus-text">
        <div className="aboutus-whyus-text-topic">
          <h1>WHY</h1><span>US</span>
        </div>
        <p className='whyus-p'>  We provide accurate local service information and a user-friendly 
          platform for a seamless experience. Stay connected through real-time 
          chat in a trusted community of verified users.Our dedicated team is always ready to 
          assist with any questions or concerns.</p>

          <div className="whyus-all-lists">
          <div className="list-items-aboutus-whyus">
            <img src={tick} alt="" />
            <p>Comprehensive Information</p>
          </div>

          <div className="list-items-aboutus-whyus">
            <img src={tick} alt="" />
            <p>User-Friendly Platform</p>
          </div>

          <div className="list-items-aboutus-whyus">
            <img src={tick} alt="" />
            <p>Real-Time Communication</p>
          </div> 
          
          <div className="list-items-aboutus-whyus">
            <img src={tick} alt="" />
            <p>Trusted Community</p>
          </div> 
          
          <div className="list-items-aboutus-whyus">
            <img src={tick} alt="" />
            <p>Continuous Support</p>
          </div>

          </div>
      </div>
      
    </div>
  )
}

export default WhyUs
