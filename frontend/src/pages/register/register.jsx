import styles from './register.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.msg || 'Registration failed');
                return;
            }

            // Auto-login: store token and redirect to home (as requested)
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.name);

            navigate('/');
        } catch (err) {
            console.error('Register error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.parent}>
            <div className={styles.RegisterBox}>
                <h1 className={styles.h1}>Register</h1>

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
                            name="name"
                            placeholder="Full Name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            autoComplete="off"
                            className={`${styles.inputs} form-control`}
                            name="email"
                            placeholder="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            className={`${styles.inputs} form-control`}
                            name="password"
                            placeholder="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            className={`${styles.inputs} form-control`}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.btnSubmitForRig}>
                        <button
                            className={`${styles.btn} btn btn-primary`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                        <div className="log">
                            Already Have Account?{' '}
                            <a href="/login" className={`${styles.aReg}`}>
                                Login
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;