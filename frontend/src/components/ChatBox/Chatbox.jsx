import styles from './Chatbox.module.css';
import { useState , useEffect, useRef, useCallback} from 'react';
import Markdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';


function ChatBox (){
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false); // لمؤشر التحميل
  const textareaRef = useRef(null);
  const divToEndOfChat = useRef(null);
  const API_URL = 'http://localhost:5002/api/message';

  const WELCOME_MESSAGE_Group = 
  {
    role:'evo',
    content: 'Hello, I am Evo !! Lets Start Summarize Your Ideas...'
  }


function handleTextarea(event) {
  setContent(event.target.value);
}


  // دالة مساعدة لتحديث حالة الرسائل بشكل متزايد
  const appendChunkToLastMessage = useCallback((chunk) => {
    setMessages(prevMessages => {
      // نأخذ آخر رسالة (والتي يجب أن تكون رسالة البوت الفارغة)
      const lastMessage = prevMessages[prevMessages.length - 1];
      
      // نتأكد أننا نحدث رسالة البوت
      if (lastMessage && lastMessage.role === 'evo') {
        return [
          ...prevMessages.slice(0, -1), // كل الرسائل ما عدا الأخيرة
          { 
            ...lastMessage, 
            content: lastMessage.content + chunk // إضافة الجزء الجديد إلى المحتوى
          }
        ];
      }
      return prevMessages;
    });
  }, []);


  const oSend = async () => {
    const userMessageContent = content.trim();

    if (userMessageContent.length === 0 || isLoading) return;

setMessages(prevMessages => [
  ...prevMessages,
  { content: userMessageContent, role: "user" },
  { content: "", role: "evo" }  // placeholder للبوت
]);

    
    setContent('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // مهم جداً: يجب أن تكون استجابة Fetch قابلة للقراءة
          'Accept': 'text/plain' 
        },
        body: JSON.stringify({ message: userMessageContent }),
      });

      if (!response.body) {
        throw new Error("Response body is not available for streaming.");
      }
      
      // 3. الحصول على قارئ الدفق (ReadableStream)
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8"); // لفك تشفير البيانات من bytes إلى string

      // 4. حلقة لقراءة الدفق بشكل متزايد
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) {
          // انتهى الدفق
          break;
        }

        // فك تشفير الجزء وتحقق من الأخطاء البسيطة
        const chunk = decoder.decode(value, { stream: true });
        
        
        // ensure chat scrolls as bot streams
        appendChunkToLastMessage(chunk);
        console.log("Received chunk:", chunk);
        divToEndOfChat.current?.scrollIntoView({ behavior: 'smooth' });
      }

    } catch (error) {
      console.error("Streaming Error:", error);
      // تحديث الرسالة الأخيرة في حالة حدوث خطأ
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'evo') {
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: (lastMessage.content || "Sorry, ") + "An error occurred while streaming the response. Check the console." }
          ];
        }
        return [...prev, { role: "evo", content: "Sorry, an error occurred. Please try again." }];
      });
      
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(()=>{
    if(textareaRef){
      textareaRef.current.focus()
    }
  },[])

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
  
  





    return(
                <main className={styles.chatContainer}>




                    <div className={styles.chatHeader}>

                      <h1 className={styles.headlogo}>Evo Note</h1>
                      <p className={styles.slogan}>Where Your Ideas Evolve</p>
                    
                    </div>






                    <div className={styles.ChatBox}>

                      {[WELCOME_MESSAGE_Group, ...messages].map(({role, content}, index) => (
                        <div key={index} data-role={role} className={styles.Message}>
                          <Markdown>{content}</Markdown>
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
                        ref={textareaRef}
                        
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