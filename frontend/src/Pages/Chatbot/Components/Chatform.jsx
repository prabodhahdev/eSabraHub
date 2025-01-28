import React, { useRef } from 'react'

const Chatform = ({chatHistory ,setChatHistory , generateBotResponse }) => {

    const inputRef = useRef();

    const handleFormSubmit = (e) =>{
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;

        inputRef.current.value = "";
        // console.log(typeof setChatHistory); 
        setChatHistory((history) => [...history, {role: "user",text: userMessage}]);

        setTimeout(()=> {
            setChatHistory((history) => [...history, {role: "model",text: "Thinking..."}]);

            generateBotResponse([...chatHistory,{role: "user",text: `Using the details provided above, please address this query: ${userMessage}`}]);
        },600);
        
        
    };

    

  return (
    <div>
         <form action="" className="chat-form" onSubmit={handleFormSubmit}>
              <input ref={inputRef} type="text" placeholder='Message...' className="message-input" required/>
              <button className="material-symbols-rounded">keyboard_arrow_up</button>
            </form>
      
    </div>
  )
}

export default Chatform
