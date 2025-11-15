import styles from './login.module.css';
import { useState, useRef } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const data = useRef('');

    addEventListener('input',()=>{setEmail(data.current?.value)});

  async  function handel(e) {
    e.preventDefault();
  await  setEmail(data.current?.value);
   await console.log(email)

   await api.post('/register', {
    email: email,
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

  };




    return(
        <div className={styles.parent}>


            <div className={styles.loginBox}>


                <h1 className={styles.h1}>
                    Login
                </h1>


                <form action={"/login"} method="post"onSubmit={handel}>
                    <div className='mb-3'>
                        <input autoComplete="off" autoFocus className={`${styles.inputs} form-control `} name="email" placeholder="Email" type="Email" ref={data}/>
                    </div>
                    <div className='mb-3'>
                        <input className={`${styles.inputs} form-control `} name="password" placeholder="Password" type="password" />
                    </div>
                    <div className={styles.btnSubmitForRig}>
                        <div className={`${styles.reFor}`}>
                            <div className="re">
                                               <label className="labelCheck" htmlFor="remember-for">
                                                <input type="checkbox" id="remember-for" className="inputCheck" /> Remember me</label>                     
                             </div>
                            <div className="for">
                                <a href="#" className={`${styles.forgetpasswordA}`}>Forget Password?</a>
                            </div>
                        </div>
                        <button className={`${styles.btn} btn btn-primary`} type="submit">Login</button>
                        <div className="reg">Don't Have an Account ? <a href="./register" className={`${styles.aReg}`}>Register</a></div>
                    </div>
                </form>


            </div>



        </div>


    )
}

export default Login;