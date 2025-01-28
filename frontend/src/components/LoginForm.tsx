import React, { useState } from 'react';
import { MdLockOutline } from 'react-icons/md';
import { LuUserRound } from 'react-icons/lu';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaRegCircleUser } from 'react-icons/fa6';
import loginImage from '../assets/Loginpage.png'; // Update the path based on your file location

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setMessage(data.message);
      localStorage.setItem('user', JSON.stringify(data.user));

      const userRole = data.user.role;
      switch (userRole) {
        case 'administrator':
          window.location.href = '/subjectadd';
          break;
        case 'student':
          window.location.href = '/dashboard';
          break;
        case 'lecturer':
          window.location.href = '/lecdashboard';
          break;
        default:
          setMessage('Unknown user role');
      }
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(160deg, #00ACC1, #4DD0E1)',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '20px',
          margin: '0 auto',
          display: 'flex',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#80DEEA',
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            flex: 1,
            padding: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#E0F7FA',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <FaRegCircleUser style={{ width: '80px', height: '80px', color: '#00ACC1' }} />
          </div>
          <form
            onSubmit={handleSubmit}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Username Field with Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#B2EBF2',
              }}
            >
              <LuUserRound style={{ color: '#00ACC1', fontSize: '20px' }} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  fontSize: '16px',
                  backgroundColor: 'transparent',
                  color: '#00ACC1',
                  outline: 'none',
                }}
              />
            </div>

            {/* Password Field with Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#B2EBF2',
              }}
            >
              <MdLockOutline style={{ color: '#00ACC1', fontSize: '20px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  fontSize: '16px',
                  backgroundColor: 'transparent',
                  color: '#00ACC1',
                  outline: 'none',
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              >
                {showPassword ? (
                  <FaEye style={{ color: '#00ACC1' }} />
                ) : (
                  <FaEyeSlash style={{ color: '#00ACC1' }} />
                )}
              </span>
            </div>

            {/* Other Elements */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Remember Username
              </label>
              <a
                href="#"
                style={{
                  fontSize: '14px',
                  color: '#4f84ff',
                  textDecoration: 'none',
                }}
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#00ACC1',
                color: '#fff',
                cursor: 'pointer',
              }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div
          style={{
            flex: 1,
            padding: '40px',
            backgroundImage: `url(${loginImage})`,
            backgroundSize: 'cover',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '60px', marginBottom: '20px' ,color: '#00ACC1' }}>Welcome</h1>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
