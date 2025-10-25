import './header.css'; 


function Header() {

  return(

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className="container">

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

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div className="d-flex flex-lg-row flex-column align-items-lg-center gap-2 mt-3 mt-lg-0">
            <button className="btn btn-outline-light px-4 py-2">Log in</button>
            <button className="btn btn-primary px-4 py-2">Sign up</button>
          </div>
        </div>
      </div>
    </nav>


  
        )
      }




export default Header;