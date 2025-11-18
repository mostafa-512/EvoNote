import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Home from './Home';
import Login from './pages/login/login'
import Register from './pages/register/register'
import NotFound from './NotFound'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>


    
  )
}

export default App  
