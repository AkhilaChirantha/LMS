import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface Enrollment {
  username: string;
  subjectId: string;
  grade: string;
}

const AddGradesForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [grade, setGrade] = useState('');
  const [message, setMessage] = useState('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [subjectId, setSubjectId] = useState<string>(''); // State to hold subjectId

  const location = useLocation();
  const subjectIdFromDashboard = location.state?.subjectId; // Retrieve subjectId from the state

  // Set the subjectId initially from the URL state
  useEffect(() => {
    if (subjectIdFromDashboard) {
      setSubjectId(subjectIdFromDashboard);
    }
  }, [subjectIdFromDashboard]);

  // Fetch all enrollments
  const fetchEnrollments = async () => {
    try {
      if (!subjectId) return; // Ensure subjectId exists before fetching
      const response = await axios.get(`http://localhost:5001/api/enrolments/allresult?subjectId=${subjectId}`);
      const filteredEnrollments = response.data.filter(
        (enrollment: Enrollment) => enrollment.subjectId === subjectId
      );
      setEnrollments(filteredEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  // Submit new enrollment
  const handleEnrollmentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!subjectId || !username || !grade) {
      setMessage('Please provide all required fields');
      return; // Prevent form submission if fields are missing
    }

    try {
      const response = await axios.patch('http://localhost:5001/api/enrolments/add', {
        username,
        subjectId,  // Automatically send subjectId from state
        grade
      });
      setMessage(response.data.message);
      setUsername('');
      setGrade('');
      fetchEnrollments(); // Refresh the enrollments list
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || 'An error occurred while adding the enrollment.'
      );
    }
  };

  useEffect(() => {
    fetchEnrollments(); // Fetch enrollments on component mount or when subjectId changes
  }, [subjectId]);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Add Grades for {subjectId}</h2>
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
          <label htmlFor="grade" style={{ display: 'block', marginBottom: '5px' }}>
            Add Grade:
          </label>
          <input
            id="grade"
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
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
          disabled={!subjectId} // Disable the button if subjectId is not set
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
      {enrollments.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Username</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.username}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.grade}</td>
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

export default AddGradesForm;
