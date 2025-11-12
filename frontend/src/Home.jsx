import { useState, useEffect } from 'react';
import Header from './components/header/header';
import ChatBox from './components/ChatBox/Chatbox';
import Loader from './components/Loader/Loader'
function Home() {

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true)
    // Simulate a delay for loading state
    const timer = setTimeout(() => { setIsLoading(false) }, 1000);
    return () => clearTimeout(timer);
  }, [])


  return (
    <>
    {isLoading && <Loader />}

    <Header />
    
    <ChatBox />



    </>
  )
}

export default Home ;  
