import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface LecEnroll {
  username: string;
  subjectId: string;
  subjectName: string;
}

const EnrollLecturer: React.FC = () => {
  const [username, setUsername] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [message, setMessage] = useState('');
  const [lecenrollments, setLecEnrollments] = useState<LecEnroll[]>([]);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lecenrollments/alllec');
      setLecEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleEnrollmentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/api/lecenrollments/addlec', {
        username,
        subjectId,
      });
      setMessage(response.data.message);
      setUsername('');
      setSubjectId('');
      fetchEnrollments();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'An error occurred while adding the enrollment.');
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div style={{ 
      background: 'linear-gradient(to right, #fef9d7, #d299c2)',
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#333', fontWeight: 'bold', marginBottom: '20px' }}>Enroll Lecturer</h2>
        <form onSubmit={handleEnrollmentSubmit}>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label htmlFor="username" style={{ fontWeight: 'bold', color: '#555' }}>Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginTop: '5px'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label htmlFor="subjectId" style={{ fontWeight: 'bold', color: '#555' }}>Subject ID:</label>
            <input
              id="subjectId"
              type="text"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginTop: '5px'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4db8ff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Enroll
          </button>
        </form>
        {message && (
          <p style={{ marginTop: '15px', color: message.includes('successfully') ? 'green' : 'red' }}>
            {message}
          </p>
        )}

        <h3 style={{ marginTop: '20px', color: '#666' }}>Enrolled Lecturers</h3>
        {lecenrollments.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#4db8ff', color: 'white' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Username</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Subject ID</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Subject Name</th>
              </tr>
            </thead>
            <tbody>
              {lecenrollments.map((enrollment, index) => (
                <tr key={index} style={{ backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                  <td style={{ padding: '10px' }}>{enrollment.username}</td>
                  <td style={{ padding: '10px' }}>{enrollment.subjectId}</td>
                  <td style={{ padding: '10px' }}>{enrollment.subjectName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#777' }}>No enrollments found.</p>
        )}
      </div>
    </div>
  );
};

export default EnrollLecturer;