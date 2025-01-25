import React, { useState } from 'react';
import { MdLockOutline } from 'react-icons/md';
import { LuUserRound } from 'react-icons/lu';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaRegCircleUser } from 'react-icons/fa6';


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
        minHeight: '100vh',
        width: 'auto',
        height: 'auto',
        background: 'linear-gradient(135deg, #3F62A5FF, #9822B6FF)',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          flexWrap: 'wrap',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#1c1c3c',
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '300px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <FaRegCircleUser style={{ width: '80px', height: '80px', color: '#fff' }} />
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
                backgroundColor: '#2b2b4a',
              }}
            >
              <LuUserRound style={{ color: '#fff', fontSize: '20px' }} />
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
                  color: '#fff',
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
                backgroundColor: '#2b2b4a',
              }}
            >
              <MdLockOutline style={{ color: '#fff', fontSize: '20px' }} />
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
                  color: '#fff',
                  outline: 'none',
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              >
                {showPassword ? (
                  <FaEye style={{ color: '#fff' }} />
                ) : (
                  <FaEyeSlash style={{ color: '#fff' }} />
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
                backgroundColor: '#4f84ff',
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
            padding: '20px',
            background: 'url(https://via.placeholder.com/400)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: '300px',
          }}
        >
          <h1 style={{ fontSize: '40px', marginBottom: '20px', marginLeft:"80px" }}>Welcome</h1>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;