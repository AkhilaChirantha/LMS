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
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Manage Grades for {subjectId}</h2>
      <h3>Enrolled Students</h3>
      {enrollments.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Username</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Grade</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Fix Grade</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.username}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <select
                    value={enrollment.grade}
                    onChange={(e) => handleGradeChange(index, e.target.value)}
                    disabled={enrollment.isFixed}
                    style={{ width: '100%' }}
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
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={enrollment.isFixed}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
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
