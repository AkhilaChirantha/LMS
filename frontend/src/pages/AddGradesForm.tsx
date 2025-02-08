import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface Enrollment {
  username: string;
  subjectId: string;
  grade: string;
  isFixed: boolean;
}

const AddGradesForm: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [subjectId, setSubjectId] = useState<string>('');

  const location = useLocation();
  const subjectIdFromDashboard = location.state?.subjectId;

  useEffect(() => {
    if (subjectIdFromDashboard) {
      setSubjectId(subjectIdFromDashboard);
    }
  }, [subjectIdFromDashboard]);

  const fetchEnrollments = async () => {
    try {
      if (!subjectId) return;
      const response = await axios.get(`http://localhost:5001/api/enrolments/allresult?subjectId=${subjectId}`);
      const filteredEnrollments = response.data.filter(
        (enrollment: Enrollment) => enrollment.subjectId === subjectId
      );
      setEnrollments(filteredEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [subjectId]);

  const updateEnrollment = async (enrollment: Enrollment) => {
    try {
      await axios.patch(`http://localhost:5001/api/enrolments/add`, enrollment);
    } catch (error) {
      console.error('Error updating enrollment:', error);
    }
  };

  const handleGradeChange = (index: number, grade: string) => {
    const updatedEnrollments = [...enrollments];
    if (!updatedEnrollments[index].isFixed) {
      updatedEnrollments[index].grade = grade;
      setEnrollments(updatedEnrollments);
      updateEnrollment(updatedEnrollments[index]);
    }
  };

  const handleCheckboxChange = (index: number) => {
    const updatedEnrollments = [...enrollments];
    updatedEnrollments[index].isFixed = !updatedEnrollments[index].isFixed;
    setEnrollments(updatedEnrollments);
    updateEnrollment(updatedEnrollments[index]);
  };

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
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '10px', color: '#333', fontWeight: 'bold' }}>Manage Grades for {subjectId}</h2>
        <h3 style={{ color: '#666', marginBottom: '20px' }}>Enrolled Students</h3>
        {enrollments.length > 0 ? (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'separate', 
            borderSpacing: '0 10px',
            marginTop: '20px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#4db8ff', color: 'white', borderRadius: '8px' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Username</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Grade</th>
                <th style={{ padding: '12px', textAlign: 'center', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Fix Grade</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment, index) => (
                <tr key={index} style={{ backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginBottom: '10px' }}>
                  <td style={{ padding: '12px', borderRadius: '8px 0 0 8px' }}>{enrollment.username}</td>
                  <td style={{ padding: '12px' }}>
                    <select
                      value={enrollment.grade}
                      onChange={(e) => handleGradeChange(index, e.target.value)}
                      disabled={enrollment.isFixed}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        backgroundColor: enrollment.isFixed ? '#e0e0e0' : 'white',
                        cursor: enrollment.isFixed ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="B-">B-</option>
                      <option value="C+">C+</option>
                      <option value="C">C</option>
                      <option value="D+">D+</option>
                      <option value="D">D</option>
                      <option value="D-">D-</option>
                      <option value="E">E</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', borderRadius: '0 8px 8px 0' }}>
                    <input
                      type="checkbox"
                      checked={enrollment.isFixed}
                      onChange={() => handleCheckboxChange(index)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                  </td>
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

export default AddGradesForm;