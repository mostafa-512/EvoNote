import './header.css';


function Header() {
    
//   let x = document.getElementById('Links');
//   let menuBtn = document.querySelector('.menuBtn');

//   function openMenu(){
//     x.style.display = 'block';
//   }

    return(
        <header className='header'>

          <div className="logo">
            <a href="" id='home'>EvoNote</a>
          </div>

        <div className="inOut">
              <span className='menuBtn'>&#9776;</span>
              <span className='closeBtn'>&#9746;</span>

              <div className='Links' id='#Links'>

              <div className="Login">Login</div>
              <div className="register">Register</div>
              
              </div>


            </div>

        </header>
    )


}
export default Header;