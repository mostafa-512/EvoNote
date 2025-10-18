import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

        <header className='header'>

          <div className="logo">
            <a href="" id='home'>EvoNote</a>
          </div>

          <div className="inOut">

              <div className="Login">Login</div>
              
              <div className="register">Register</div>
              {/* <div className="menu">
                <select name="menu-phone" id="Burger">

                <option value="Settings">settings</option>
                <option value="">settings</option> 
                <option value="Logout">Logout</option> 

              </select>
              </div> */}

            </div>

        </header>


        <main className='main'>
                <div className="chat">

                </div>
        </main>








    </>
  )
}

export default App  
