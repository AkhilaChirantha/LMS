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

  // Fetch all enrollments
  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lecenrollments/alllec');
      setLecEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  // Submit new enrollment
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
      fetchEnrollments(); // Refresh the enrollments list
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || 'An error occurred while adding the enrollment.'
      );
    }
  };

  useEffect(() => {
    fetchEnrollments(); // Fetch enrollments on component mount
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Enroll Lecture</h2>
      <form onSubmit={handleEnrollmentSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="subjectId" style={{ display: 'block', marginBottom: '5px' }}>
            Subject ID:
          </label>
          <input
            id="subjectId"
            type="text"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
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

      <h3>Enrolled Students</h3>
      {lecenrollments.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Username</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Subject ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Subject Name</th>
            </tr>
          </thead>
          <tbody>
            {lecenrollments.map((enrollment, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.username}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.subjectId}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.subjectName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No enrollments found.</p>
      )}
    </div>
  );
};

export default EnrollLecturer;
