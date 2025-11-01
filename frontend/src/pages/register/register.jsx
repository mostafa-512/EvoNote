import styles from './register.module.css';


function Register() {
    return(
        <div className={styles.parent}>


            <div className={styles.RegisterBox}>


                <h1 className={styles.h1}>
                    Register
                </h1>


                <form method="post">
                    <div className='mb-3'>
                        <input autoComplete="off" autoFocus className={`${styles.inputs} form-control `} name="firstName" placeholder="First Name" type="text" />
                    </div>
                    <div className='mb-3'>
                        <input autoComplete="off"  className={`${styles.inputs} form-control `} name="lastName" placeholder="Last Name" type="text" />
                    </div>
                    <div className='mb-3'>
                        <input autoComplete="off" className={`${styles.inputs} form-control `} name="Email" placeholder="Email" type="Email" />
                    </div>
                    <div className='mb-3'>
                        <input className={`${styles.inputs} form-control `} name="password" placeholder="Password" type="password" />
                    </div>
                    <div className='mb-3'>
                        <input className={`${styles.inputs} form-control `} name="Repassword" placeholder="Re Enter Password" type="password" />
                    </div>
                    <div className={styles.btnSubmitForRig}>
                        <div className={`${styles.reFor}`}>
                        </div>
                        <button className={`${styles.btn} btn btn-primary`} type="submit">Register</button>
                        <div className="log">Already Have Account ? <a href="./login" className={`${styles.aReg}`}>Register</a></div>
                    </div>
                </form>


            </div>



        </div>


    )
}

export default Register;