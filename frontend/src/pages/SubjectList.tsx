import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubjectList: React.FC = () => {
    const [subjects, setSubjects] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/subjects');
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };
        fetchSubjects();
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
                maxWidth: '1000px', 
                padding: '30px', 
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Arial, sans-serif',
                width: '100%',
                textAlign: 'center'
            }}>
                <h2 style={{ color: '#333', fontSize: '28px', marginBottom: '20px', fontWeight: 'bold' }}>Subjects List</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#4db8ff', color: '#ffffff' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Year</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Semester</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Subject ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Subject Name</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Credits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject) => (
                            <tr key={subject._id} style={{ borderBottom: '1px solid #ddd', transition: '0.3s' }}>
                                <td style={{ padding: '12px', background: '#ffffff' }}>{subject.year}</td>
                                <td style={{ padding: '12px', background: '#ffffff' }}>{subject.semester}</td>
                                <td style={{ padding: '12px', background: '#ffffff' }}>{subject.subjectId}</td>
                                <td style={{ padding: '12px', background: '#ffffff' }}>{subject.subjectName}</td>
                                <td style={{ padding: '12px', background: '#ffffff' }}>{subject.credit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '10px' }}>
                    <button onClick={() => navigate('/subjectadd')} style={buttonStyle}>Add Subject</button>
                    <button onClick={() => navigate('/enrollsubject')} style={buttonStyle}>Enroll Student</button>
                    <button onClick={() => navigate('/enrolllec')} style={buttonStyle}>Enroll Lecturer</button>
                    <button onClick={() => navigate('/removesubject')} style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}>Remove Subject</button>
                </div>
            </div>
        </div>
    );
};

const buttonStyle: React.CSSProperties = {
    padding: '12px 20px',
    backgroundColor: '#45aaf2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: '0.3s',
    textTransform: 'uppercase',
    fontWeight: 'bold',
};

export default SubjectList;