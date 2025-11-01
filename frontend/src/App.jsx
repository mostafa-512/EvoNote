import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './components/header/header';
import ChatBox from './components/ChatBox/Chatbox';
import Login from './pages/login/login';
import Register from './pages/register/register';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
    
    <ChatBox />

    {/* <Login  /> */}

    {/* <Register /> */}


    </>
  )
}

export default App  
