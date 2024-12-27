import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5001/api/users/login', {
                username,
                password,
            });

            
            setMessage(response.data.message);
            // Store user info in localStorage or state if needed
            localStorage.setItem('user', JSON.stringify(response.data.user));

             // Navigate based on user role
             const userRole = response.data.user.role;
             if (userRole === 'administrator') {
                 navigate('/subjectadd'); // Path for the subject page
             } else {
                 navigate('/'); // Path for the hero page
             }
            
        } catch (error: any) {
            setMessage(
                error.response?.data?.message || 'Something went wrong. Please try again.'
            );
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '1em' }}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginPage;
