import styles from './login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5002/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.msg || 'Login failed');
                return;
            }

            // Store token and username in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.name);

            // Navigate to home (as requested)
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.parent}>
            <div className={styles.loginBox}>
                <h1 className={styles.h1}>Login</h1>

                {error && (
                    <div className={`alert alert-danger ${styles.errorMsg}`} role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            autoComplete="off"
                            autoFocus
                            className={`${styles.inputs} form-control`}
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            className={`${styles.inputs} form-control`}
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.btnSubmitForRig}>
                        <div className={`${styles.reFor}`}>
                            <div className="re">
                                <label className="labelCheck" htmlFor="remember-for">
                                    <input type="checkbox" id="remember-for" className="inputCheck" />
                                    Remember me
                                </label>
                            </div>
                            <div className="for">
                                <a href="#" className={`${styles.forgetpasswordA}`}>
                                    Forget Password?
                                </a>
                            </div>
                        </div>
                        <button
                            className={`${styles.btn} btn btn-primary`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                        <div className="reg">
                            Don't Have an Account?{' '}
                            <a href="/register" className={`${styles.aReg}`}>
                                Register
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;