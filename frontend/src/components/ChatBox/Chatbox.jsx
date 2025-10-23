import './Chatbox.css';
import TextareaAutosize from 'react-textarea-autosize';


function ChatBox (){


    return(
                <main className='main'>

                  <div className="chat">


                    <div className="head">

                      <h1 className='headh1'>Evo Note</h1>
                      <p className='slogan'>Where Your Ideas Evolve</p>
                    
                    </div>

                    <div className="ChatDiv">
                      <TextareaAutosize  placeholder="Summarize Your Ideas"
                        // className={styles.TextArea}
                        // value={content}
                        // onChange={handleTextarea} 
                        // onKeyDown={HitEnter}
                        // minRows={1}
                        // maxRows={4}
                        // disabled={isDisabled}
                        // ref={textareaReef}
              
                        />
                    </div>



                  </div>
        </main>
    )

}

export default ChatBox;