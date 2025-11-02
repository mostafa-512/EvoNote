import { useEffect, useState } from 'react';
import './header.css'; 


function Header() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("username");

    if (token){
      setIsLoggedIn(true);
      setUsername(name)
    }

  },[]);

  function handleLogout(){
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  return(

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className={"container"}>

        <a className="navbar-brand fw-bold fs-4" href="#">
          EvoNote
        </a>


<button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

{!isLoggedIn ? (
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div className="d-flex flex-lg-row flex-column align-items-lg-center gap-2 mt-3 mt-lg-0">
  
    
              <button className="btn btn-outline-light px-4 py-2 LoginBtn">Log in</button>
            <button className="btn btn-primary px-4 py-2 SignupBtn">Sign up</button>
  </div>
  </div>

):( 
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div className="d-flex flex-lg-row flex-column align-items-lg-center gap-2 mt-3 mt-lg-0 d">
                <div className="userContainer">

                <button 
                  className="btn px-4 py-2"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="user"
            className="avatar"
            />
                </button>

          <p className='tuser'>{username}</p>
          {openMenu && (

          <div className="userProfile">
            <button className="menuItem logout" onClick={handleLogout}>Log out</button>
          </div>

          )}
          </div>

            </div>
           </div>

)
}

      </div>
    </nav>


  
);
}




export default Header;