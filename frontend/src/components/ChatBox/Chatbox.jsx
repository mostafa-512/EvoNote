import styles from './Chatbox.module.css';
import { useState , useEffect, useRef} from 'react';
import Markdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';


function ChatBox (){


const divToEndOfChat = useRef(null);
const textareaReef = useRef(null);

const [messages, setMessages] = useState([]);

const [content, setContent] = useState("");
function handleTextarea(event) {
  setContent(event.target.value);
}

function oSend(){
  if(content.length>0){
  setMessages((prevMessages)=> [...prevMessages, {content, role: "user"}]);
  setContent('');
}
console.log([...messages]);
}


      function HitEnter(event) {
        if(event.key === 'Enter'&& !event.shiftKey){
          event.preventDefault()
          oSend()
  
        }
      }



  useEffect(()=>{
    const lastMessage = messages[messages.length -1];
    if (lastMessage?.role === 'user'){
      divToEndOfChat.current?.scrollIntoView({ behavior: 'smooth' });
    }
  },[messages])
  
  


    const WELCOME_MESSAGE_Group = 
    {
      role:'evo',
      content: 'Hello, I am Evo !! Lets Start Summarize Your Ideas...'
    }



    return(
                <main className={styles.chatContainer}>




                    <div className={styles.chatHeader}>

                      <h1 className={styles.headlogo}>Evo Note</h1>
                      <p className={styles.slogan}>Where Your Ideas Evolve</p>
                    
                    </div>






                    <div className={styles.ChatBox}>

                      {[WELCOME_MESSAGE_Group, ...messages].map(({role, content}, index) => (
                        <div key={index} data-role={role} className={styles.Message}>
                          {content}
                        </div>
                      ))}




                      
                    <div className="" ref={divToEndOfChat}></div>



                    </div>






                    <div className={styles.chatInput}>


                      <TextareaAutosize  placeholder="Summarize Your Ideas"
                        className={styles.TextArea}
                        value={content}
                        onChange={handleTextarea} 
                        onKeyDown={HitEnter}
                        minRows={1}
                        maxRows={4}
                        // disabled={isDisabled}
                        ref={textareaReef}
                        
                        />

                      <button className={styles.SendBtn} onClick={oSend}>

                              <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#5f6368"
        >
        <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
      </svg>
            </button>

                        </div>


        </main>
    )
    
  }
  
  



  export default ChatBox;