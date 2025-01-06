import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/image.png";

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
            localStorage.setItem('user', JSON.stringify(response.data.user));

            const userRole = response.data.user.role;
            if (userRole === 'administrator') {
                navigate('/subjectadd');
            } else {
                navigate('/');
            }

        } catch (error: any) {
            setMessage(
                error.response?.data?.message || 'Something went wrong. Please try again.'
            );
        }
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", backgroundColor: "#114f3c", padding: "20px" }}></div>

            <div style={{
                backgroundColor: "#00796b",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 20px",
            }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={logo} alt="University Logo" style={{ height: "100px", marginRight: "15px" }} />
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "48px",
                                fontWeight: "bold",
                                lineHeight: "1.2",
                                fontFamily: "Roboto Condensed, sans-serif"
                            }}
                        >
                            Sabaragamuwa University of Sri Lanka
                        </h1>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "48px",
                            }}
                        >
                            GPA Prediction
                        </h2>
                    </div>
                </div>
            </div>

            <div style={{
                maxWidth: '380px',
                margin: 'auto',
                padding: '1em',
                border:'1px solid #ccc',
                backgroundColor: '#f8f9fa',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                fontFamily: 'Arial, sans-serif',
                marginTop: '20px'
            }}>
                <h1 style={{ textAlign: 'center', color: '#333' }}>Login</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                padding: '0.5em',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                fontSize: '1em'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                padding: '0.5em',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                fontSize: '1em'
                            }}
                        />
                    </div>
                    <button type="submit" style={{
                        padding: '0.75em',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                    }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                    >
                        Login
                    </button>
                </form>
                {message && <p style={{
                    marginTop: '1em',
                    color: message.includes('wrong') ? 'red' : 'green',
                    textAlign: 'center'
                }}>{message}</p>}
            </div>

            

            {/* Footer Section */}
            <footer style={{
                backgroundColor: "#555",
                marginTop:"5px",
                color: "white",
               padding:"-10px",
                fontFamily: "Arial, sans-serif"
            }}>
                <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", padding: "0 20px" }}>
                    <div style={{ flex: 1, minWidth: "200px", margin: "10px" }}>
                        <h3>Contact Us</h3>
                        <p style={{fontSize:"12px"}}>Sabaragamuwa University of Sri Lanka<br />PO Box 02<br />Pambahinna, Sri Lanka - 70140</p>
                        <p style={{lineHeight:"25px",fontSize:"12px" }}>Tel: 0452280049<br />Email: <a href="mailto:vleadmin@sab.ac.lk" style={{ color: "lightblue",fontSize:"12px" }}>vleadmin@sab.ac.lk</a></p>
                    </div>
                    <div style={{ flex: 1, minWidth: "200px", margin: "10px" }}>
                        <h3>About Us</h3>
                        <ul style={{ listStyle: "none", padding: 0, lineHeight:"25px"  }}>
                            <li><a href="https://www.sab.ac.lk/about-the-university" style={{ color: "lightblue",fontSize:"12px" }}>SUSL</a></li>
                            <li><a href="https://www.sab.ac.lk/fgs/" style={{ color: "lightblue",fontSize:"12px" }}>Graduate Studies</a></li>
                            <li><a href="https://www.sab.ac.lk/codl/" style={{ color: "lightblue",fontSize:"12px" }}>CODL</a></li>
                        </ul>
                    </div>
                    <div style={{ flex: 1, minWidth: "200px", margin: "10px" }}>
                        <h3>Research</h3>
                        <ul style={{ listStyle: "none", padding: 0, lineHeight:"25px"  }}>
                            <li><a href="#" style={{ color: "lightblue", fontSize:"12px" }}>Research Grants</a></li>
                            <li><a href="#" style={{ color: "lightblue",fontSize:"12px" }}>Ongoing Research</a></li>
                            <li><a href="#" style={{ color: "lightblue",fontSize:"12px" }}>Journals</a></li>
                        </ul>
                    </div>
                    <div style={{ flex: 1, minWidth: "200px", margin: "10px" }}>
                        <h3>Quick Links</h3>
                        <ul style={{ listStyle: "none", padding: 0, lineHeight:"25px" }}>
                            <li><a href="https://www.sab.ac.lk/lib/" style={{ color: "lightblue",fontSize:"12px" }}>Main Library</a></li>
                            <li><a href="#" style={{ color: "lightblue",fontSize:"12px" }}>Digital Library</a></li>
                            <li><a href="https://www.sab.ac.lk/student-counseling" style={{ color: "lightblue",fontSize:"12px" }}>Students Counsellors</a></li>
                        </ul>
                    </div>
                </div>
                <div style={{ display:"flex",textAlign: "center", marginTop: "0px", borderTop: "1px solid #777", paddingTop: "12px" }}>
                    <p style={{marginLeft:"80px",fontSize:"12px"}}>© 2020, All rights reserved by Sabaragamuwa University of Sri Lanka</p>
                    <p><a href="#" style={{ marginLeft:"250px",color: "lightblue",fontSize:"12px" }}>Get the mobile app</a></p>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
