import React, { useRef, useState } from 'react'
import Chatboticon from './Components/Chatboticon.jsx'
import Chatform from './Components/Chatform.jsx'
import ChatMessage from './Components/ChatMessage.jsx'
import { WebsiteInfo } from './Components/WebsiteInfo.js'
import './Chatbot.css'
// import keyboard_arrow_up from './assets/keyboard_arrow_up.png'
// import keyboard_arrow_down from './assets/keyboard_arrow_down.png'
// import mode_comment from './assets/mode_comment.png'

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([{
    hideInChat: true,
    role: "model",
    text: WebsiteInfo

  }]);
  const [showChatbot, setShowChatbot]=useState(false);

  const generateBotResponse = async(history)=>{
    const updateHistory =(text) =>{
      setChatHistory(prev =>[...prev.filter(msg => msg.text !== "Thinking..."),{role:"model", text}])
    };

    history = history.map(({role,text})=>({role, parts: [{text}]}))
    const requestOptions = {
      method : "POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({contents: history})
    }

    try{
      const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=AIzaSyCBusqZmPPK-tzxRwAIbwltLRCp92_ncLA",requestOptions);
    //   const response = new GoogleGenerativeAI("AIzaSyCBusqZmPPK-tzxRwAIbwltLRCp92_ncLA");
      
      const data = await response.json();
      if(!response.ok)throw new Error(data.error.message || "Something went wrong");

      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
      updateHistory(apiResponseText);


    }catch(error){
      console.log(error);

    }

  }

  return (
    
    <div className={`container ${showChatbot ? 'show-chatbot':""}`}>
      <button onClick={()=>setShowChatbot(prev => !prev)} id="chatbot-toggler">
        {/* <img src={mode_comment} alt="" /> */}
        <span className='material-symbols-rounded'>mode_comment</span>
        <span className='material-symbols-rounded'>close</span>
      </button>
      <div className='chatbot-popup'>
      <div className="chat-header">
        <div className="header-info">
          <Chatboticon/>
          <h2 className="logo-text">eSabrahub chatBot</h2>
          
        </div>
        <button className='material-symbols-rounded'>keyboard_arrow_down</button>
        </div>

        {/* Chatbot Body */}
        <div  className="chat-body">
          <div className="message bot-message">
            <Chatboticon/>
            <p className="message-text"> Hey there 👋<br/> How can i help You today??
            </p>
          </div>

          {chatHistory.map((chat, index)=>(
            <ChatMessage key={index} chat={chat}/>
          ))}

          
          </div>

          <div className="chat-footer">
           <Chatform chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
          </div>
        </div>
      
      </div>
    
  )
}

export default Chatbot
