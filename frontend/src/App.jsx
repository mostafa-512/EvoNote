import { useState } from 'react';
import './App.css';
import Header from './components/header/header';
import ChatBox from './components/ChatBox/Chatbox';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
    
    <ChatBox />



    </>
  )
}

export default App  
