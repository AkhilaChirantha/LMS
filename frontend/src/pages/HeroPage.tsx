import React from 'react';
import HeropageImage from '../assets/Heropage.png'; // Adjust this path if needed

const HeroPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'auto',
        backgroundColor: '#F5FAFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          left: '-100px',
          width: '500px',
          height: '500px',
          backgroundColor: '#E3F2FD',
          borderRadius: '80%',
          zIndex: '-1',
        }}
      ></div>
      <div style={{ maxWidth: '500px', marginRight: '50px' }}>
        <h1 style={{ fontSize: '50px', fontWeight: 'bold', color: '#1E1E1E' }}>
          <span style={{ color: '#F4B400' }}>Track</span> Your Academic Journey
          with Ease!
        </h1>
        <p
          style={{
            fontSize: '20px',
            color: '#4F4F4F',
            lineHeight: '1.8',
          }}
        >
          Our GPA Calculator helps you effortlessly calculate your grades, track
          your academic progress, and predict your future GPA. Stay organized
          and achieve your academic goals with our easy-to-use tool.
        </p>
        <div style={{ marginTop: '40px' }}>
          <button
            style={{
              padding: '20px 60px',
              borderRadius: '30px',
              border: 'none',
              backgroundImage: 'linear-gradient(90deg, #2196F3, #21CBF3)',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </div>
      </div>
      <div style={{ position: 'relative', maxWidth: '50%' }}>
        <img
          src={HeropageImage}
          alt="Academic Journey"
          style={{
            width: '137%',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '50px',
          }}
        />
      </div>
    </div>
  );
};

export default HeroPage;
