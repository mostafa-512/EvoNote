import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css'; 

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("username");

    if (token && name) {
      setIsLoggedIn(true);
      setUsername(name);
    } else {
      setIsLoggedIn(false);
    }

    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      if (!newToken) {
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  function handleLogout(){
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setOpenMenu(false);
    navigate("/");
  };

  return(
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className={"container"}>
        <a className="navbar-brand fw-bold fs-4" href="/">
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
              <button className="btn btn-outline-light px-4 py-2 LoginBtn" onClick={() => navigate("/login")}>Log in</button>
              <button className="btn btn-primary px-4 py-2 SignupBtn" onClick={() => navigate("/register")}>Sign up</button>
            </div>
          </div>
        ) : (
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <div className="d-flex flex-lg-row flex-column align-items-lg-center gap-2 mt-3 mt-lg-0">
              <div className="userContainer" style={{ position: "relative" }}>
                <button 
                  className="btn px-4 py-2"
                  onClick={() => setOpenMenu(!openMenu)}
                  style={{ background: "none", border: "none" }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="user"
                    className="avatar"
                    style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                  />
                </button>
                <p style={{ margin: "0 0 0 10px", color: "white" }}>
                    {username}
                </p>
                {openMenu && (
                  <div
                    className="userProfile"
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: "0",
                      background: "white",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      marginTop: "10px",
                      zIndex: 1000,
                    }}
                  >
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={handleLogout}
                      style={{ margin: "10px", width: "calc(100% - 20px)" }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;