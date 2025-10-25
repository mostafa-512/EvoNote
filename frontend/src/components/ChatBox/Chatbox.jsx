import './Chatbox.css';
import TextareaAutosize from 'react-textarea-autosize';


function ChatBox (){


    return(
                <main className='chatContainer'>




                    <div className="chatHeader">

                      <h1 className='headlogo'>Evo Note</h1>
                      <p className='slogan'>Where Your Ideas Evolve</p>
                    
                    </div>



                    <div className="ChatBox">
                      
                    </div>

                    <div className="chatInput">


                      <TextareaAutosize  placeholder="Summarize Your Ideas"
                        // className={styles.TextArea}
                        // value={content}
                        // onChange={handleTextarea} 
                        // onKeyDown={HitEnter}
                        minRows={1}
                        maxRows={4}
                        // disabled={isDisabled}
                        // ref={textareaReef}
                        
                        />


                              <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#5f6368"
      >
        <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
      </svg>

                        </div>


        </main>
    )

}

export default ChatBox;